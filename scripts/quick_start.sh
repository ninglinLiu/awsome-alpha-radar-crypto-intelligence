#!/bin/bash

# Alpha Radar Quick Start Script
# 一键初始化和启动项目

set -e

echo "🛰️  Alpha Radar - Quick Start"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.9+"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ Python $(python3 --version)"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - DATABASE_URL"
    echo "   - TELEGRAM_BOT_TOKEN (optional)"
    echo ""
    read -p "Press Enter after configuring .env..."
fi

# 安装依赖
echo "📦 Installing Node.js dependencies..."
npm install

echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

echo ""
echo "✅ Dependencies installed!"
echo ""

# 检查数据库
echo "🔍 Checking database connection..."
if node -e "require('dotenv').config(); const {Pool} = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT 1').then(() => {console.log('✅ Database connected'); process.exit(0)}).catch(err => {console.error('❌ Database connection failed:', err.message); process.exit(1)})"; then
    echo ""
else
    echo ""
    echo "⚠️  Database connection failed!"
    echo "Please check your DATABASE_URL in .env"
    echo ""
    echo "Quick options:"
    echo "1. Use local PostgreSQL:"
    echo "   DATABASE_URL=postgresql://user:password@localhost:5432/alpha_radar"
    echo ""
    echo "2. Use Docker:"
    echo "   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=alphapass -e POSTGRES_DB=alpha_radar postgres:15-alpine"
    echo ""
    read -p "Press Enter after fixing database configuration..."
fi

# 初始化数据库
echo "🔧 Initializing database..."
node scripts/init_db.js

echo ""
echo "📡 Running initial data crawl..."
npm run crawler

echo ""
echo "🤖 Processing signals with AI..."
python3 backend/ai_engine/batch_processor.py

echo ""
echo "✅ Setup completed!"
echo ""
echo "🚀 Starting Alpha Radar..."
echo ""
echo "You can start the services with:"
echo "  1. API Server:      npm run api"
echo "  2. Frontend:        npm run dev"
echo "  3. Scheduler:       node backend/scheduler/cron_jobs.js"
echo "  4. Telegram Bot:    npm run telegram-bot"
echo ""
echo "Or use PM2 for production:"
echo "  pm2 start ecosystem.config.js"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "📡 API will be available at: http://localhost:8000"
echo ""
echo "📚 Documentation: README.md"
echo "🚀 Deployment guide: DEPLOYMENT.md"
echo ""
echo "Happy hunting for Alpha! 🎯"


