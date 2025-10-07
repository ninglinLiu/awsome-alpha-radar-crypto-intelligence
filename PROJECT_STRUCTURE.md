# 📁 Alpha Radar Project Structure

```
alpha-radar/
├── 📱 Frontend (Next.js)
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx           # 顶部导航栏
│   │   │   ├── SignalCard.tsx       # 信号卡片组件
│   │   │   ├── StatsPanel.tsx       # 统计面板
│   │   │   └── FilterBar.tsx        # 筛选器
│   │   ├── lib/
│   │   │   └── api.ts               # API 调用封装
│   │   ├── layout.tsx               # 全局布局
│   │   ├── page.tsx                 # 主页面
│   │   └── globals.css              # 全局样式
│   │
│   ├── next.config.js               # Next.js 配置
│   ├── tailwind.config.js           # Tailwind CSS 配置
│   └── postcss.config.js            # PostCSS 配置
│
├── 🔧 Backend (Node.js)
│   ├── config/
│   │   └── database.js              # 数据库配置与初始化
│   │
│   ├── crawler/
│   │   └── index.js                 # 多源爬虫主程序
│   │       ├── crawlBinanceAnnouncements()
│   │       ├── crawlCoinDeskNews()
│   │       ├── crawlDeFiLlama()
│   │       ├── crawlCMCTrending()
│   │       └── runAllCrawlers()
│   │
│   ├── api/
│   │   └── server.js                # Express API 服务器
│   │       ├── GET  /api/signals
│   │       ├── GET  /api/stats
│   │       ├── POST /api/crawl
│   │       └── POST /api/feedback
│   │
│   ├── telegram/
│   │   └── bot.js                   # Telegram Bot
│   │       ├── sendDailyDigest()
│   │       ├── sendInstantAlert()
│   │       └── bot commands (/top, /stats, /help)
│   │
│   └── scheduler/
│       └── cron_jobs.js             # 定时任务调度器
│           ├── Crawlers (每30分钟)
│           ├── AI Processing (每小时)
│           └── Telegram Digest (每天9点)
│
├── 🤖 AI Engine (Python)
│   └── backend/ai_engine/
│       ├── signal_processor.py      # AI 信号处理器
│       │   ├── get_embedding()      # 向量化
│       │   ├── analyze_sentiment()  # 情绪分析
│       │   ├── generate_summary()   # 摘要生成
│       │   ├── semantic_clustering() # 语义聚类
│       │   └── calculate_signal_score() # 评分算法
│       │
│       └── batch_processor.py       # 批量处理脚本
│
├── 🛠️ Scripts
│   ├── init_db.js                   # 数据库初始化
│   ├── test_system.js               # 系统测试
│   └── quick_start.sh               # 快速启动脚本
│
├── 🐳 Docker
│   ├── docker-compose.yml           # Docker Compose 配置
│   ├── Dockerfile.api               # API Docker 镜像
│   ├── Dockerfile.scheduler         # Scheduler Docker 镜像
│   └── Dockerfile.frontend          # Frontend Docker 镜像
│
├── 📝 Configuration
│   ├── package.json                 # Node.js 依赖
│   ├── requirements.txt             # Python 依赖
│   ├── .env.example                 # 环境变量模板
│   ├── .gitignore                   # Git 忽略文件
│   ├── tsconfig.json                # TypeScript 配置
│   └── ecosystem.config.js          # PM2 配置
│
├── 📚 Documentation
│   ├── README.md                    # 项目说明文档
│   ├── DEPLOYMENT.md                # 部署指南
│   ├── PROJECT_STRUCTURE.md         # 项目结构说明 (本文件)
│   └── LICENSE                      # MIT 开源协议
│
└── 📊 Logs (自动生成)
    ├── api-error.log
    ├── api-out.log
    ├── scheduler-error.log
    └── telegram-error.log
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Data Flow Diagram                     │
└─────────────────────────────────────────────────────────┘

1. DATA COLLECTION (每30分钟)
   ┌──────────────┐
   │  Scheduler   │
   └──────┬───────┘
          ↓
   ┌──────────────┐     Exchange APIs, RSS, DeFi APIs
   │   Crawlers   │ ←──────────────────────────────────
   └──────┬───────┘     (Binance, CoinDesk, DeFiLlama)
          ↓
   ┌──────────────┐
   │  PostgreSQL  │     Raw signals stored
   └──────┬───────┘
          ↓

2. AI PROCESSING (每小时)
   ┌──────────────┐
   │ Batch        │
   │ Processor    │
   └──────┬───────┘
          ↓
   ┌──────────────┐     OpenAI API
   │ AI Engine    │ ←─────────────
   └──────┬───────┘     (Embeddings, GPT-4)
          ↓
          ├─→ Sentiment Analysis
          ├─→ Semantic Clustering
          ├─→ Summary Generation
          └─→ Score Calculation
          ↓
   ┌──────────────┐
   │  PostgreSQL  │     Updated signals with AI data
   └──────┬───────┘
          ↓

3. DELIVERY
   ┌──────────────┐
   │  PostgreSQL  │
   └──────┬───────┘
          ↓
          ├────────────┐
          ↓            ↓
   ┌──────────┐  ┌──────────┐
   │ REST API │  │ Telegram │
   └────┬─────┘  └────┬─────┘
        ↓             ↓
   ┌──────────┐  ┌──────────┐
   │ Frontend │  │  Users   │
   │Dashboard │  │  (Bot)   │
   └──────────┘  └──────────┘
```

---

## 🗄️ Database Schema

### signals
```sql
id              SERIAL PRIMARY KEY
title           TEXT NOT NULL
source          TEXT NOT NULL          -- "Binance", "CoinDesk", etc.
type            TEXT NOT NULL          -- "listing", "news", "onchain"
timestamp       TIMESTAMP WITH TIME ZONE
score           FLOAT DEFAULT 0        -- AI-calculated score (0-100)
sentiment       TEXT                   -- "Positive", "Negative", "Neutral"
volume_change   FLOAT
tags            JSONB                  -- ["meme", "defi", "listing"]
url             TEXT
summary         TEXT                   -- AI-generated summary
raw_data        JSONB                  -- Original data
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### source_trust
```sql
id              SERIAL PRIMARY KEY
source_name     TEXT UNIQUE NOT NULL
trust_score     FLOAT DEFAULT 0.5      -- 0.0 - 1.0
total_votes     INTEGER DEFAULT 0
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### user_feedback
```sql
id              SERIAL PRIMARY KEY
signal_id       INTEGER REFERENCES signals(id)
user_id         TEXT
rating          INTEGER (1-5)
comment         TEXT
created_at      TIMESTAMP DEFAULT NOW()
```

---

## 🔌 API Endpoints

### Signals
- `GET /api/signals` - Get filtered signals
  - Query params: `source`, `type`, `min_score`, `hours`, `limit`, `offset`
- `GET /api/signals/:id` - Get signal by ID
- `GET /api/trending-tags` - Get trending tags

### Stats
- `GET /api/stats` - Get 24h statistics
  - Returns: total signals, sources, sentiment breakdown

### Actions
- `POST /api/crawl` - Trigger manual crawl
- `POST /api/feedback` - Submit user feedback

### Health
- `GET /api/health` - Health check

---

## 🎯 Key Features by Module

### 📡 Crawler Module
- ✅ Multi-source support (4+ sources)
- ✅ Unified signal format
- ✅ Error handling & retry logic
- ✅ Rate limiting compliance
- ✅ Automatic deduplication

### 🤖 AI Engine
- ✅ OpenAI GPT-4 integration
- ✅ Sentence embeddings (text-embedding-3-small)
- ✅ Cosine similarity clustering
- ✅ Multi-factor scoring algorithm
- ✅ Batch processing optimization

### 🎨 Frontend
- ✅ Server-side rendering (Next.js 14)
- ✅ Real-time updates (5min auto-refresh)
- ✅ Responsive design (mobile-first)
- ✅ Dark mode with glass morphism
- ✅ Advanced filtering UI

### 🤖 Telegram Bot
- ✅ Daily digest (Top 10)
- ✅ Instant alerts (score >= 85)
- ✅ Interactive commands
- ✅ Markdown formatting
- ✅ Rate limit handling

---

## 🔧 Environment Variables

### Required
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### Optional
```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
TWITTER_BEARER_TOKEN=...
DISCORD_BOT_TOKEN=...
```

---

## 📊 Metrics & KPIs

### System Performance
- Crawl frequency: Every 30 minutes
- AI processing: Every hour
- API response time: < 500ms
- Database queries: < 100ms

### Data Quality
- Signal deduplication rate: ~85%
- AI processing accuracy: GPT-4 baseline
- Source coverage: 4+ major sources
- Update latency: < 5 minutes

---

## 🚀 Deployment Options

1. **Development**: Local setup with `npm run dev`
2. **Production (Docker)**: `docker-compose up -d`
3. **Cloud (Vercel + Railway)**: Separate frontend/backend
4. **VPS (PM2)**: `pm2 start ecosystem.config.js`

---

## 📖 Related Files

- **Setup**: `README.md`, `scripts/quick_start.sh`
- **Deployment**: `DEPLOYMENT.md`, `docker-compose.yml`
- **Config**: `package.json`, `requirements.txt`, `.env.example`
- **Code**: See directory structure above

---

**Last Updated**: 2025-10-07
**Version**: 1.0.0

