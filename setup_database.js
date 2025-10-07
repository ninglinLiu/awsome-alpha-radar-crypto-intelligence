const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database
const dbPath = path.join(__dirname, 'alpha_radar.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create signals table
  db.run(`
    CREATE TABLE IF NOT EXISTS signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      type TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      score REAL DEFAULT 0,
      sentiment TEXT,
      volume_change REAL,
      tags TEXT,
      url TEXT,
      summary TEXT,
      raw_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating signals table:', err);
    } else {
      console.log('✅ Signals table created');
    }
  });

  // Create source_trust table
  db.run(`
    CREATE TABLE IF NOT EXISTS source_trust (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_name TEXT UNIQUE NOT NULL,
      trust_score REAL DEFAULT 0.5,
      total_votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_feedback table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      signal_id INTEGER REFERENCES signals(id),
      user_id TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert mock data
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

  // Insert each signal
  mockSignals.forEach((signal, index) => {
    db.run(`
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
    ], (err) => {
      if (err) {
        console.error(`Error inserting signal ${index + 1}:`, err);
      } else {
        console.log(`✅ Signal ${index + 1} inserted`);
      }
    });
  });

  // Query all signals
  db.all('SELECT * FROM signals ORDER BY score DESC', (err, rows) => {
    if (err) {
      console.error('Error querying signals:', err);
    } else {
      console.log(`✅ Found ${rows.length} signals in database`);
      rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.title} (${row.source}) - Score: ${row.score}`);
      });
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database closed successfully');
        console.log('🎉 Alpha Radar database setup completed!');
      }
    });
  });
});
