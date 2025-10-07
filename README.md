# 🛰️ Alpha Radar - Crypto Intelligence Aggregator

<div align="center">

**去中心化加密情报聚合系统**  
*Decentralized Crypto Intelligence Aggregator*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

*"信息自由的起点，是洞察之物的公平。"*

[🌐 Live Demo](#) | [📖 Documentation](#) | [🐛 Report Bug](#) | [✨ Request Feature](#)

</div>

---

## 🧭 项目愿景

Alpha Radar 致力于构建一个**不依赖中心化媒体与算法推荐的情报系统**，通过：
- 🤖 **自动化抓取** - 多源数据实时采集
- 🧠 **AI 语义聚类** - 智能信息去重与分类
- 📊 **多维度评分** - 来源可信度 + 情绪分析 + 热度计算
- 🔔 **智能推送** - Telegram Bot + Web 仪表盘

让每一个普通投资者都能在**一级信息源头感知趋势**。

---

## ✨ 核心特性

### 📡 数据采集层
- ✅ **交易所公告**: Binance, OKX, Bybit
- ✅ **链上数据**: DeFiLlama, DEXTools
- ✅ **新闻媒体**: CoinDesk, WuBlockchain
- ✅ **趋势数据**: CoinMarketCap, CryptoRank
- 🔄 **自动调度**: 每30分钟自动抓取

### 🤖 AI 信号引擎
- 🧠 **语义聚类**: OpenAI Embeddings + 相似度合并
- 💭 **情绪分析**: Positive/Negative/Neutral
- 🔥 **热度计算**: 时间衰减 + 来源权重
- 📝 **智能摘要**: GPT-4 自动生成

### 📊 评分系统
```
Score = w1*SourceTrust + w2*Sentiment + w3*Recency + w4*Type
```
- 来源可信度：基于历史准确性
- 情绪权重：市场情绪指标
- 时效性：48小时衰减模型
- 类型权重：Listing > Announcement > News

### 🎨 Web 仪表盘
- 📱 **响应式设计**: Mobile-first UI
- 🎭 **玻璃态风格**: Modern glass morphism
- 🔍 **多维筛选**: 来源/类型/评分/时间
- 📈 **实时统计**: 24h 数据可视化

### 🤖 Telegram Bot
- 📤 **每日摘要**: Top 10 信号推送
- ⚡ **即时警报**: 高分信号(85+)实时通知
- 💬 **交互命令**: `/top`, `/stats`, `/help`

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────┐
│              Alpha Radar 系统架构                    │
├────────────┬────────────┬────────────┬──────────────┤
│  数据采集   │  AI 分析   │  聚合排名  │   展示推送   │
│  Crawlers  │   Engine   │  Ranking   │   Frontend   │
├────────────┴────────────┴────────────┴──────────────┤
│              PostgreSQL Database                     │
└─────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术选型 |
|------|---------|
| 前端 | Next.js 14, React, Tailwind CSS, Recharts |
| 后端 | Node.js, Express, Axios, Cheerio |
| AI | Python, OpenAI API, Transformers, FAISS |
| 数据库 | PostgreSQL, Redis (可选) |
| 推送 | Telegram Bot API, Notion API |
| 部署 | Docker, Vercel, Railway, Supabase |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.9+
- PostgreSQL 15+ (或使用 Docker)
- OpenAI API Key

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/alpha-radar.git
cd alpha-radar
```

### 2. 安装依赖

```bash
# Node.js 依赖
npm install

# Python 依赖
pip install -r requirements.txt
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/alpha_radar

# OpenAI API
OPENAI_API_KEY=sk-your-key-here

# Telegram Bot (可选)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 4. 初始化数据库

```bash
node scripts/init_db.js
```

### 5. 启动服务

#### 开发模式

```bash
# Terminal 1: API 服务器
npm run api

# Terminal 2: 前端
npm run dev

# Terminal 3: 爬虫 (首次运行)
npm run crawler

# Terminal 4: AI 处理 (首次运行)
python backend/ai_engine/batch_processor.py
```

#### 使用 Docker (推荐)

```bash
docker-compose up -d
```

访问 `http://localhost:3000` 查看仪表盘！

---

## 📚 使用指南

### 运行爬虫

```bash
# 手动运行一次
npm run crawler

# 或使用调度器 (自动每30分钟运行)
node backend/scheduler/cron_jobs.js
```

### AI 信号处理

```bash
# 处理所有未分析的信号
python backend/ai_engine/batch_processor.py
```

### Telegram Bot

```bash
# 启动 Bot
npm run telegram-bot

# 在 Telegram 中使用
/start - 开始使用
/top - 查看 Top 5 信号
/stats - 查看统计数据
/help - 帮助信息
```

### 系统测试

```bash
node scripts/test_system.js
```

---

## 🎯 API 文档

### 获取信号列表

```bash
GET /api/signals
```

**参数:**
- `source` - 来源筛选 (Binance, CoinDesk, etc.)
- `type` - 类型筛选 (listing, announcement, etc.)
- `min_score` - 最低分数 (0-100)
- `hours` - 时间范围 (默认: 48)
- `limit` - 返回数量 (默认: 50)
- `offset` - 分页偏移 (默认: 0)

**示例:**
```bash
curl "http://localhost:8000/api/signals?min_score=80&hours=24&limit=10"
```

### 获取统计数据

```bash
GET /api/stats
```

### 触发手动爬取

```bash
POST /api/crawl
```

### 提交反馈

```bash
POST /api/feedback
Content-Type: application/json

{
  "signal_id": 123,
  "rating": 5,
  "comment": "Very useful!"
}
```

---

## 📊 数据库结构

### signals 表

```sql
CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE,
  score FLOAT DEFAULT 0,
  sentiment TEXT,
  volume_change FLOAT,
  tags JSONB,
  url TEXT,
  summary TEXT,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### source_trust 表

```sql
CREATE TABLE source_trust (
  id SERIAL PRIMARY KEY,
  source_name TEXT UNIQUE NOT NULL,
  trust_score FLOAT DEFAULT 0.5,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 高级配置

### 自定义评分权重

编辑 `backend/ai_engine/signal_processor.py`:

```python
def calculate_signal_score(self, signal, source_trust=0.5):
    # 调整权重
    w1, w2, w3, w4 = 0.3, 0.2, 0.3, 0.2  # 默认
    # w1: 来源可信度, w2: 情绪, w3: 时效性, w4: 类型
    ...
```

### 添加新的爬虫

1. 在 `backend/crawler/index.js` 中添加新函数:

```javascript
async function crawlNewSource() {
  // 实现爬取逻辑
  const signals = [];
  // ... 抓取数据
  return signals.map(item => new Signal({
    source: 'NewSource',
    type: 'news',
    title: item.title,
    url: item.url,
    tags: ['custom']
  }));
}
```

2. 在 `runAllCrawlers` 中调用:

```javascript
const newSignals = await crawlNewSource();
allSignals.push(...newSignals);
```

### 调整调度频率

编辑 `backend/scheduler/cron_jobs.js`:

```javascript
// 改为每15分钟运行一次
const crawlerJob = schedule.scheduleJob('*/15 * * * *', async () => {
  await runAllCrawlers();
});
```

---

## 🚀 部署指南

### Vercel (前端)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Railway (后端 + 数据库)

1. 在 Railway 创建项目
2. 添加 PostgreSQL 服务
3. 连接 GitHub 仓库
4. 配置环境变量
5. 自动部署

### Docker Compose (完整部署)

```bash
# 编辑 .env 配置
vim .env

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 服务器部署 (VPS)

```bash
# 使用 PM2 管理进程
npm install -g pm2

# 启动服务
pm2 start backend/api/server.js --name alpha-api
pm2 start backend/scheduler/cron_jobs.js --name alpha-scheduler
pm2 start npm --name alpha-frontend -- start

# 保存配置
pm2 save
pm2 startup
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循 ESLint 配置
- 添加必要的注释
- 编写单元测试
- 更新文档

---

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ 多源数据自动抓取
- ✅ AI 情绪分析与评分
- ✅ Web 仪表盘
- ✅ Telegram Bot 推送

### v2.0 (Q2 2025)
- 🔄 去中心化信任系统（社区投票）
- 🔄 Twitter/X 实时监控
- 🔄 Discord 集成
- 🔄 Notion 自动同步
- 🔄 移动端 PWA

### v3.0 (Q3 2025)
- 📅 DAO 治理机制
- 📅 数据 API 商业化
- 📅 链上信号验证
- 📅 代币激励模型

### v4.0 (Future)
- 🚀 Alpha Radar Protocol
- 🚀 去中心化信息中继层
- 🚀 跨链信号聚合

---

## 📜 License

本项目基于 MIT License 开源。详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- [OpenAI](https://openai.com/) - AI 引擎
- [RSSHub](https://docs.rsshub.app/) - RSS 聚合
- [DeFiLlama](https://defillama.com/) - 链上数据
- [CoinDesk](https://www.coindesk.com/) - 新闻来源

---

## 📧 联系我们

- 🐦 Twitter: [@alpharadar](https://twitter.com/alpharadar)
- 💬 Telegram: [@alpharadar_community](https://t.me/alpharadar_community)
- 📧 Email: hello@alpharadar.io
- 🌐 Website: https://alpharadar.io

---

## ⚖️ 免责声明

⚠️ **本项目仅供教育和研究目的。**

- 本系统提供的信息不构成投资建议
- 加密货币投资有风险，请谨慎决策
- 所有信号仅供参考，不对任何投资损失负责
- 请遵守当地法律法规

---

<div align="center">

**🛰️ Alpha Radar - 信息民主化的武器**

*"像开源的 Bloomberg，但属于每一个有求知欲的人。"*

⭐ **如果这个项目对你有帮助，请给个 Star！** ⭐

</div>

