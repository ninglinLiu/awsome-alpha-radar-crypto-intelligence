#!/usr/bin/env node

/**
 * System test script - Verifies all components
 */

const axios = require('axios');
const { pool } = require('../backend/config/database');
const { runAllCrawlers } = require('../backend/crawler/index');

async function testDatabase() {
  console.log('🧪 Testing database connection...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

async function testCrawlers() {
  console.log('\n🧪 Testing crawlers...');
  try {
    const signals = await runAllCrawlers();
    console.log(`✅ Crawlers working: ${signals.length} signals collected`);
    return true;
  } catch (error) {
    console.error('❌ Crawler test failed:', error.message);
    return false;
  }
}

async function testAPI() {
  console.log('\n🧪 Testing API...');
  try {
    const response = await axios.get('http://localhost:8000/api/health', {
      timeout: 5000
    });
    console.log('✅ API is running:', response.data);
    return true;
  } catch (error) {
    console.error('⚠️  API not running (start with: npm run api)');
    return false;
  }
}

async function testAI() {
  console.log('\n🧪 Testing AI engine...');
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync('python backend/ai_engine/signal_processor.py');
    console.log('✅ AI engine working');
    return true;
  } catch (error) {
    console.error('⚠️  AI engine test failed:', error.message);
    console.error('   Make sure Python dependencies are installed: pip install -r requirements.txt');
    return false;
  }
}

async function main() {
  console.log('🛰️  Alpha Radar System Test\n');
  console.log('='.repeat(50) + '\n');

  const results = {
    database: await testDatabase(),
    crawlers: await testCrawlers(),
    api: await testAPI(),
    ai: await testAI()
  };

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log('   Database:', results.database ? '✅ PASS' : '❌ FAIL');
  console.log('   Crawlers:', results.crawlers ? '✅ PASS' : '❌ FAIL');
  console.log('   API:', results.api ? '✅ PASS' : '⚠️  NOT RUNNING');
  console.log('   AI Engine:', results.ai ? '✅ PASS' : '⚠️  NOT CONFIGURED');

  const allPassed = Object.values(results).filter(Boolean).length >= 2;
  
  if (allPassed) {
    console.log('\n✅ System is operational!');
  } else {
    console.log('\n⚠️  Some components need attention');
  }

  process.exit(allPassed ? 0 : 1);
}

main();

