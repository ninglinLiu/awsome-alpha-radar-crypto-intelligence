const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database
const dbPath = path.join(__dirname, '../alpha_radar.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create table
  db.run(`
    CREATE TABLE IF NOT EXISTS signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      score REAL DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✅ Table created successfully');
    }
  });

  // Insert test data
  db.run(`
    INSERT INTO signals (title, source, score) 
    VALUES ('Test Signal', 'TestSource', 85.5)
  `, (err) => {
    if (err) {
      console.error('Error inserting data:', err);
    } else {
      console.log('✅ Test data inserted');
    }
  });

  // Query data
  db.all('SELECT * FROM signals', (err, rows) => {
    if (err) {
      console.error('Error querying data:', err);
    } else {
      console.log('✅ Query result:', rows);
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database closed');
      }
    });
  });
});

