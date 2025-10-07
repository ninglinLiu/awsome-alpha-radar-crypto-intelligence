const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// SQLite database connection
const dbPath = path.join(__dirname, '../../alpha_radar.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
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
          reject(err);
          return;
        }
        console.log('✅ Signals table created');
      });

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON signals(timestamp DESC)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_signals_score ON signals(score DESC)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_signals_source ON signals(source)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_signals_type ON signals(type)`);

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

      console.log('✅ SQLite database initialized successfully');
      resolve();
    });
  });
}

// SQLite query wrapper
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ rows: [], lastID: this.lastID, changes: this.changes });
      });
    }
  });
}

module.exports = {
  db,
  initializeDatabase,
  query
};
