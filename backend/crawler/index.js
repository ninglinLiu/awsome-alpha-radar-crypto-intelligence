const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const { pool } = require('../config/database');
require('dotenv').config();

const rssParser = new Parser({
  customFields: {
    item: ['pubDate', 'description', 'link']
  }
});

// Unified signal format
class Signal {
  constructor(data) {
    this.source = data.source;
    this.type = data.type;
    this.title = data.title;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.url = data.url;
    this.raw_text = data.raw_text || '';
    this.tags = data.tags || [];
  }
}

// 1. Binance Announcements Crawler
async function crawlBinanceAnnouncements() {
  try {
    console.log('📡 Crawling Binance announcements...');
    const response = await axios.get('https://www.binance.com/bapi/composite/v1/public/cms/article/list/query', {
      params: {
        type: 1,
        pageSize: 20,
        pageNo: 1
      }
    });

    const signals = [];
    const articles = response.data?.data?.articles || [];

    for (const article of articles) {
      const signal = new Signal({
        source: 'Binance',
        type: 'announcement',
        title: article.title,
        timestamp: new Date(article.releaseDate).toISOString(),
        url: `https://www.binance.com/en/support/announcement/${article.code}`,
        raw_text: article.title,
        tags: ['exchange', 'binance', detectAnnouncementType(article.title)]
      });
      signals.push(signal);
    }

    console.log(`✅ Found ${signals.length} Binance signals`);
    return signals;
  } catch (error) {
    console.error('❌ Binance crawler error:', error.message);
    return [];
  }
}

// 2. CoinDesk News RSS Crawler
async function crawlCoinDeskNews() {
  try {
    console.log('📡 Crawling CoinDesk RSS...');
    const feed = await rssParser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
    
    const signals = feed.items.slice(0, 20).map(item => new Signal({
      source: 'CoinDesk',
      type: 'news',
      title: item.title,
      timestamp: new Date(item.pubDate).toISOString(),
      url: item.link,
      raw_text: item.contentSnippet || item.description,
      tags: ['news', 'media']
    }));

    console.log(`✅ Found ${signals.length} CoinDesk signals`);
    return signals;
  } catch (error) {
    console.error('❌ CoinDesk crawler error:', error.message);
    return [];
  }
}

// 3. DeFiLlama TVL Changes
async function crawlDeFiLlama() {
  try {
    console.log('📡 Crawling DeFiLlama protocols...');
    const response = await axios.get('https://api.llama.fi/protocols');
    
    const signals = [];
    const protocols = response.data.slice(0, 20);

    for (const protocol of protocols) {
      if (protocol.change_1d && Math.abs(protocol.change_1d) > 10) {
        const signal = new Signal({
          source: 'DeFiLlama',
          type: 'onchain',
          title: `${protocol.name}: TVL ${protocol.change_1d > 0 ? '+' : ''}${protocol.change_1d.toFixed(2)}% (24h)`,
          url: `https://defillama.com/protocol/${protocol.slug}`,
          raw_text: `${protocol.name} TVL: $${(protocol.tvl / 1e6).toFixed(2)}M`,
          tags: ['defi', 'tvl', protocol.category || 'unknown']
        });
        signals.push(signal);
      }
    }

    console.log(`✅ Found ${signals.length} DeFiLlama signals`);
    return signals;
  } catch (error) {
    console.error('❌ DeFiLlama crawler error:', error.message);
    return [];
  }
}

// 4. CoinMarketCap Trending
async function crawlCMCTrending() {
  try {
    console.log('📡 Crawling CoinMarketCap trending...');
    const response = await axios.get('https://api.coinmarketcap.com/data-api/v3/topsearch/rank', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const signals = [];
    const trending = response.data?.data?.cryptoTopSearchRanks || [];

    for (const item of trending.slice(0, 10)) {
      const signal = new Signal({
        source: 'CoinMarketCap',
        type: 'trending',
        title: `${item.name} (${item.symbol}) trending #${item.rank}`,
        url: `https://coinmarketcap.com/currencies/${item.slug}`,
        raw_text: `Trending rank: ${item.rank}`,
        tags: ['trending', 'cmc']
      });
      signals.push(signal);
    }

    console.log(`✅ Found ${signals.length} CMC trending signals`);
    return signals;
  } catch (error) {
    console.error('❌ CMC crawler error:', error.message);
    return [];
  }
}

// Helper: Detect announcement type
function detectAnnouncementType(title) {
  const lower = title.toLowerCase();
  if (lower.includes('list') || lower.includes('launch')) return 'listing';
  if (lower.includes('delist')) return 'delisting';
  if (lower.includes('airdrop')) return 'airdrop';
  if (lower.includes('maintenance')) return 'maintenance';
  return 'general';
}

// Save signals to database
async function saveSignals(signals) {
  if (signals.length === 0) return;

  const client = await pool.connect();
  try {
    for (const signal of signals) {
      await client.query(
        `INSERT INTO signals (title, source, type, timestamp, url, tags, raw_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          signal.title,
          signal.source,
          signal.type,
          signal.timestamp,
          signal.url,
          JSON.stringify(signal.tags),
          JSON.stringify(signal)
        ]
      );
    }
    console.log(`💾 Saved ${signals.length} signals to database`);
  } catch (error) {
    console.error('❌ Database save error:', error);
  } finally {
    client.release();
  }
}

// Main crawler orchestrator
async function runAllCrawlers() {
  console.log('🚀 Starting Alpha Radar crawlers...\n');
  
  const allSignals = [];
  
  const binanceSignals = await crawlBinanceAnnouncements();
  allSignals.push(...binanceSignals);
  
  const coindeskSignals = await crawlCoinDeskNews();
  allSignals.push(...coindeskSignals);
  
  const defiLlamaSignals = await crawlDeFiLlama();
  allSignals.push(...defiLlamaSignals);
  
  const cmcSignals = await crawlCMCTrending();
  allSignals.push(...cmcSignals);

  await saveSignals(allSignals);
  
  console.log(`\n✨ Crawling completed! Total signals: ${allSignals.length}`);
  return allSignals;
}

// Run if executed directly
if (require.main === module) {
  runAllCrawlers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllCrawlers,
  crawlBinanceAnnouncements,
  crawlCoinDeskNews,
  crawlDeFiLlama,
  crawlCMCTrending
};

