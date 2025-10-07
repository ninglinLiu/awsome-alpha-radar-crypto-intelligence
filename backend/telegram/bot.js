const TelegramBot = require('node-telegram-bot-api');
const { pool } = require('../config/database');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Format signal for Telegram
function formatSignal(signal, rank) {
  const emoji = {
    listing: '🆕',
    announcement: '📢',
    onchain: '⛓️',
    news: '📰',
    trending: '🔥'
  };

  const sentimentEmoji = {
    Positive: '📈',
    Negative: '📉',
    Neutral: '➡️'
  };

  return `
${emoji[signal.type] || '📌'} *${rank}\\. ${escapeMarkdown(signal.title)}*

🏷️ Source: ${signal.source}
⭐ Score: ${signal.score}/100
${sentimentEmoji[signal.sentiment] || '➡️'} Sentiment: ${signal.sentiment}
🕒 ${formatTimestamp(signal.timestamp)}

${signal.summary ? '📝 ' + escapeMarkdown(signal.summary) : ''}

🔗 [View Details](${signal.url})
`.trim();
}

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // minutes
  
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

// Send daily digest
async function sendDailyDigest() {
  try {
    console.log('📤 Sending daily Alpha Radar digest...');

    const result = await pool.query(`
      SELECT * FROM signals
      WHERE timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY score DESC
      LIMIT 10
    `);

    if (result.rows.length === 0) {
      await bot.sendMessage(chatId, '❌ No new signals in the last 24 hours.');
      return;
    }

    // Send header
    await bot.sendMessage(
      chatId,
      `🛰️ *ALPHA RADAR DAILY DIGEST*\n📅 ${new Date().toLocaleDateString()}\n\n🔥 Top ${result.rows.length} Signals of the Day:`,
      { parse_mode: 'Markdown' }
    );

    // Send each signal
    for (let i = 0; i < result.rows.length; i++) {
      const message = formatSignal(result.rows[i], i + 1);
      await bot.sendMessage(chatId, message, { 
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true 
      });
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ Daily digest sent successfully!');
  } catch (error) {
    console.error('❌ Telegram send error:', error);
  }
}

// Send alert for high-score signals
async function sendInstantAlert(signal) {
  try {
    if (signal.score >= 85) {
      const message = `
🚨 *HIGH PRIORITY ALERT*

${formatSignal(signal, '⚡')}
      `.trim();
      
      await bot.sendMessage(chatId, message, { 
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true 
      });
      
      console.log(`🔔 Instant alert sent for: ${signal.title}`);
    }
  } catch (error) {
    console.error('❌ Alert send error:', error);
  }
}

// Bot commands
bot.onText(/\/start/, (msg) => {
  const welcomeMessage = `
🛰️ *Welcome to Alpha Radar Bot*

Your decentralized crypto intelligence aggregator.

*Available Commands:*
/top - Get top 5 signals now
/stats - View today's statistics
/help - Show this help message

You'll receive daily digests automatically!
  `;
  
  bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/top/, async (msg) => {
  try {
    const result = await pool.query(`
      SELECT * FROM signals
      WHERE timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY score DESC
      LIMIT 5
    `);

    if (result.rows.length === 0) {
      bot.sendMessage(msg.chat.id, '❌ No signals found.');
      return;
    }

    for (let i = 0; i < result.rows.length; i++) {
      const message = formatSignal(result.rows[i], i + 1);
      await bot.sendMessage(msg.chat.id, message, { 
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true 
      });
    }
  } catch (error) {
    bot.sendMessage(msg.chat.id, '❌ Error fetching signals.');
  }
});

bot.onText(/\/stats/, async (msg) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        AVG(score) as avg_score,
        COUNT(DISTINCT source) as sources,
        COUNT(CASE WHEN sentiment = 'Positive' THEN 1 END) as positive,
        COUNT(CASE WHEN sentiment = 'Negative' THEN 1 END) as negative
      FROM signals
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `);

    const stats = result.rows[0];
    const message = `
📊 *Alpha Radar Stats (24h)*

📡 Total Signals: ${stats.total}
⭐ Avg Score: ${parseFloat(stats.avg_score).toFixed(1)}/100
🔗 Sources: ${stats.sources}
📈 Positive: ${stats.positive}
📉 Negative: ${stats.negative}
    `;

    bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(msg.chat.id, '❌ Error fetching stats.');
  }
});

bot.onText(/\/help/, (msg) => {
  const helpMessage = `
🛰️ *Alpha Radar Bot Commands*

/top - Get top 5 signals
/stats - View 24h statistics
/help - Show this message

🔔 You'll receive:
• Daily digest (top signals)
• Instant alerts (score >= 85)

🌐 Web Dashboard: [Visit](https://alpha-radar.vercel.app)
  `;
  
  bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
});

// Run if executed directly
if (require.main === module) {
  console.log('🤖 Alpha Radar Telegram Bot started!');
  console.log('📱 Waiting for commands...');
  
  // Test message
  if (chatId) {
    bot.sendMessage(chatId, '✅ Alpha Radar Bot is online!');
  }
}

module.exports = {
  bot,
  sendDailyDigest,
  sendInstantAlert
};

