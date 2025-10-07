const schedule = require('node-schedule');
const { runAllCrawlers } = require('../crawler/index');
const { sendDailyDigest } = require('../telegram/bot');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

require('dotenv').config();

console.log('🕐 Alpha Radar Scheduler starting...');

// Run crawlers every 30 minutes
const crawlerJob = schedule.scheduleJob('*/30 * * * *', async () => {
  console.log('\n🔄 [Scheduled] Running crawlers...');
  try {
    await runAllCrawlers();
    console.log('✅ [Scheduled] Crawlers completed successfully');
  } catch (error) {
    console.error('❌ [Scheduled] Crawler error:', error);
  }
});

// Run AI processing every hour
const aiProcessingJob = schedule.scheduleJob('0 * * * *', async () => {
  console.log('\n🤖 [Scheduled] Running AI signal processing...');
  try {
    const { stdout, stderr } = await execAsync('python backend/ai_engine/batch_processor.py');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ [Scheduled] AI processing completed');
  } catch (error) {
    console.error('❌ [Scheduled] AI processing error:', error);
  }
});

// Send Telegram digest daily at 9:00 AM UTC
const telegramDigestJob = schedule.scheduleJob('0 9 * * *', async () => {
  console.log('\n📤 [Scheduled] Sending Telegram digest...');
  try {
    await sendDailyDigest();
    console.log('✅ [Scheduled] Telegram digest sent');
  } catch (error) {
    console.error('❌ [Scheduled] Telegram error:', error);
  }
});

// Health check every 5 minutes
const healthCheckJob = schedule.scheduleJob('*/5 * * * *', () => {
  console.log(`💚 [Health Check] ${new Date().toISOString()} - All systems operational`);
});

console.log('✅ Scheduler initialized with jobs:');
console.log('   📡 Crawlers: Every 30 minutes');
console.log('   🤖 AI Processing: Every hour');
console.log('   📱 Telegram Digest: Daily at 9:00 AM UTC');
console.log('   💚 Health Check: Every 5 minutes');
console.log('\n⏰ Waiting for scheduled tasks...\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down scheduler...');
  schedule.gracefulShutdown().then(() => {
    console.log('✅ Scheduler stopped');
    process.exit(0);
  });
});


