const express = require('express');
const cors = require('cors');
const { query } = require('../config/database_sqlite');
const { runAllCrawlers } = require('../crawler/index');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get top signals (with filtering)
app.get('/api/signals', async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      source, 
      type, 
      min_score = 0,
      hours = 48 
    } = req.query;

    let sql = `
      SELECT 
        id, title, source, type, timestamp, score, 
        sentiment, volume_change, tags, url, summary
      FROM signals
      WHERE timestamp > datetime('now', '-${parseInt(hours)} hours')
        AND score >= ?
    `;
    
    const params = [parseFloat(min_score)];

    if (source) {
      sql += ` AND source = ?`;
      params.push(source);
    }

    if (type) {
      sql += ` AND type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY score DESC, timestamp DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
    
    // Parse JSON fields for each row
    const processedRows = result.rows.map(row => ({
      ...row,
      tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
      raw_data: row.raw_data ? (typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data) : null
    }));
    
    res.json({
      success: true,
      count: processedRows.length,
      data: processedRows
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get signal by ID
app.get('/api/signals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM signals WHERE id = ?', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Signal not found' });
    }
    
    // Parse JSON fields
    const signal = result.rows[0];
    const processedSignal = {
      ...signal,
      tags: signal.tags ? (typeof signal.tags === 'string' ? JSON.parse(signal.tags) : signal.tags) : [],
      raw_data: signal.raw_data ? (typeof signal.raw_data === 'string' ? JSON.parse(signal.raw_data) : signal.raw_data) : null
    };
    
    res.json({ success: true, data: processedSignal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_signals,
        COUNT(DISTINCT source) as total_sources,
        AVG(score) as avg_score,
        COUNT(CASE WHEN sentiment = 'Positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment = 'Negative' THEN 1 END) as negative_count,
        COUNT(CASE WHEN sentiment = 'Neutral' THEN 1 END) as neutral_count
      FROM signals
      WHERE timestamp > datetime('now', '-24 hours')
    `);

    const sourceBreakdown = await query(`
      SELECT source, COUNT(*) as count, AVG(score) as avg_score
      FROM signals
      WHERE timestamp > datetime('now', '-24 hours')
      GROUP BY source
      ORDER BY count DESC
    `);

    const typeBreakdown = await query(`
      SELECT type, COUNT(*) as count
      FROM signals
      WHERE timestamp > datetime('now', '-24 hours')
      GROUP BY type
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        overview: stats.rows[0],
        by_source: sourceBreakdown.rows,
        by_type: typeBreakdown.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trigger manual crawl
app.post('/api/crawl', async (req, res) => {
  try {
    console.log('🚀 Manual crawl triggered...');
    const signals = await runAllCrawlers();
    res.json({ 
      success: true, 
      message: `Crawled ${signals.length} signals`,
      count: signals.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit user feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { signal_id, user_id, rating, comment } = req.body;
    
    await query(
      'INSERT INTO user_feedback (signal_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [signal_id, user_id || 'anonymous', rating, comment]
    );
    
    res.json({ success: true, message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending tags
app.get('/api/trending-tags', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        json_extract(tags, '$[' || value || ']') as tag,
        COUNT(*) as count
      FROM signals, json_each(tags)
      WHERE timestamp > datetime('now', '-24 hours')
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 20
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Alpha Radar API running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/signals - Get filtered signals`);
  console.log(`   GET  /api/signals/:id - Get signal by ID`);
  console.log(`   GET  /api/stats - Get statistics`);
  console.log(`   GET  /api/trending-tags - Get trending tags`);
  console.log(`   POST /api/crawl - Trigger manual crawl`);
  console.log(`   POST /api/feedback - Submit feedback`);
});

module.exports = app;

