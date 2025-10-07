#!/usr/bin/env node

/**
 * Database initialization script
 * Run: node scripts/init_db.js
 */

const { initializeDatabase } = require('../backend/config/database_sqlite');

async function main() {
  console.log('🚀 Initializing Alpha Radar database...\n');
  
  try {
    await initializeDatabase();
    console.log('\n✅ Database initialized successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Configure .env with your API keys');
    console.log('   2. Run: npm run crawler (to collect initial data)');
    console.log('   3. Run: python backend/ai_engine/batch_processor.py (to analyze data)');
    console.log('   4. Run: npm run dev (to start frontend)');
    console.log('   5. Run: npm run api (to start API server)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();

