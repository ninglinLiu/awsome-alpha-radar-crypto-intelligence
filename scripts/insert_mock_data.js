const { query } = require('../backend/config/database_sqlite');

// 插入一些模拟信号数据
async function insertMockData() {
  console.log('📊 Inserting mock signals data...');
  
  const mockSignals = [
    {
      title: 'Bitcoin ETF Approval Expected This Week',
      source: 'CoinDesk',
      type: 'news',
      score: 92.5,
      sentiment: 'Positive',
      tags: JSON.stringify(['bitcoin', 'etf', 'regulation']),
      url: 'https://coindesk.com/bitcoin-etf-approval',
      summary: 'SEC expected to approve Bitcoin ETF by end of week, major milestone for crypto adoption',
      raw_data: JSON.stringify({ content: 'Bitcoin ETF approval news' })
    },
    {
      title: 'New Token PALU Listed on Binance',
      source: 'Binance',
      type: 'listing',
      score: 88.3,
      sentiment: 'Positive',
      tags: JSON.stringify(['listing', 'binance', 'meme']),
      url: 'https://binance.com/en/support/announcement/palu-listing',
      summary: 'PALU token officially listed on Binance with trading pairs',
      raw_data: JSON.stringify({ content: 'PALU listing announcement' })
    },
    {
      title: 'Ethereum DeFi TVL Surges 15% in 24h',
      source: 'DeFiLlama',
      type: 'onchain',
      score: 75.8,
      sentiment: 'Positive',
      tags: JSON.stringify(['ethereum', 'defi', 'tvl']),
      url: 'https://defillama.com/protocol/ethereum',
      summary: 'Ethereum DeFi protocols see significant TVL increase',
      raw_data: JSON.stringify({ content: 'TVL surge data' })
    },
    {
      title: 'SOL Trending #1 on CoinMarketCap',
      source: 'CoinMarketCap',
      type: 'trending',
      score: 82.1,
      sentiment: 'Positive',
      tags: JSON.stringify(['solana', 'trending', 'cmc']),
      url: 'https://coinmarketcap.com/currencies/solana',
      summary: 'Solana (SOL) tops trending cryptocurrencies list',
      raw_data: JSON.stringify({ content: 'SOL trending data' })
    },
    {
      title: 'Market Correction Continues',
      source: 'CoinDesk',
      type: 'news',
      score: 45.2,
      sentiment: 'Negative',
      tags: JSON.stringify(['market', 'correction', 'bearish']),
      url: 'https://coindesk.com/market-correction',
      summary: 'Crypto market continues downward trend amid regulatory concerns',
      raw_data: JSON.stringify({ content: 'Market correction news' })
    }
  ];

  for (const signal of mockSignals) {
    try {
      await query(`
        INSERT INTO signals (title, source, type, score, sentiment, tags, url, summary, raw_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        signal.title,
        signal.source,
        signal.type,
        signal.score,
        signal.sentiment,
        signal.tags,
        signal.url,
        signal.summary,
        signal.raw_data
      ]);
    } catch (error) {
      console.error('Error inserting signal:', error);
    }
  }

  console.log(`✅ Inserted ${mockSignals.length} mock signals`);
}

// 运行脚本
if (require.main === module) {
  insertMockData()
    .then(() => {
      console.log('🎉 Mock data insertion completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { insertMockData };
