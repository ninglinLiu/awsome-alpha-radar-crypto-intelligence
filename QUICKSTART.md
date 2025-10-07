# ⚡ Alpha Radar - Quick Start Guide

最快5分钟启动你的加密情报系统！

---

## 🎯 TL;DR (超快速启动)

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/alpha-radar.git
cd alpha-radar

# 2. 配置环境
cp .env.example .env
# 编辑 .env，至少配置 DATABASE_URL 和 OPENAI_API_KEY

# 3. 使用 Docker (最简单)
docker-compose up -d

# 或者本地运行
npm install
pip install -r requirements.txt
node scripts/init_db.js
npm run crawler
npm run dev
```

访问 http://localhost:3000 🎉

---

## 📋 三种启动方式

### 方式 1: Docker (推荐 ⭐)

**优点**: 零配置，一键启动，包含数据库

```bash
# 1. 配置环境变量
cp .env.example .env
nano .env  # 添加 OPENAI_API_KEY

# 2. 启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 访问
# Frontend: http://localhost:3000
# API: http://localhost:8000
```

**停止服务:**
```bash
docker-compose down
```

---

### 方式 2: 本地开发环境

**适合**: 需要修改代码或调试

**前置要求:**
- Node.js 18+
- Python 3.9+
- PostgreSQL 15+

```bash
# 1. 安装依赖
npm install
pip install -r requirements.txt

# 2. 配置数据库
# 选项 A: 使用本地 PostgreSQL
sudo -u postgres createdb alpha_radar

# 选项 B: 使用 Docker PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=alpha_radar \
  -e POSTGRES_PASSWORD=alphapass \
  postgres:15-alpine

# 3. 配置 .env
cp .env.example .env
# DATABASE_URL=postgresql://postgres:alphapass@localhost:5432/alpha_radar
# OPENAI_API_KEY=sk-your-key

# 4. 初始化
node scripts/init_db.js

# 5. 首次数据采集
npm run crawler
python backend/ai_engine/batch_processor.py

# 6. 启动服务 (开多个终端)
npm run api        # Terminal 1
npm run dev        # Terminal 2
```

---

### 方式 3: 自动化脚本

**适合**: Linux/Mac 用户

```bash
# 一键启动脚本
bash scripts/quick_start.sh

# 按提示配置 .env 后会自动完成所有设置
```

---

## 🔑 必需的配置

最小配置（`.env`）：

```env
# 数据库 (必需)
DATABASE_URL=postgresql://user:password@localhost:5432/alpha_radar

# OpenAI API (必需，用于 AI 分析)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 如何获取 OpenAI API Key

1. 访问 https://platform.openai.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制并粘贴到 `.env` 文件

---

## 🎮 核心命令

### 数据采集
```bash
# 手动运行爬虫
npm run crawler

# 自动调度（后台运行，每30分钟自动抓取）
node backend/scheduler/cron_jobs.js
```

### AI 处理
```bash
# 批量处理所有未分析的信号
python backend/ai_engine/batch_processor.py
```

### 启动服务
```bash
# 开发模式
npm run dev          # Frontend (http://localhost:3000)
npm run api          # API (http://localhost:8000)

# 生产模式 (使用 PM2)
pm2 start ecosystem.config.js
pm2 status
pm2 logs
pm2 stop all
```

### Telegram Bot
```bash
# 配置 .env 中的 Telegram 相关变量
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# 启动 Bot
npm run telegram-bot
```

### 测试系统
```bash
# 运行完整系统测试
node scripts/test_system.js
```

---

## 📊 使用流程

### 首次使用

```mermaid
graph LR
A[安装依赖] --> B[配置.env]
B --> C[初始化数据库]
C --> D[运行爬虫]
D --> E[AI处理]
E --> F[启动服务]
F --> G[访问仪表盘]
```

### 日常使用

```
1. 打开浏览器: http://localhost:3000
2. 查看最新信号
3. 使用筛选器（来源/类型/评分/时间）
4. 点击信号查看详情
5. (可选) Telegram 接收自动推送
```

---

## 🔧 常见问题

### Q: 数据库连接失败？

**A:** 检查 PostgreSQL 是否运行：
```bash
# Linux/Mac
sudo systemctl status postgresql

# Docker
docker ps | grep postgres
```

确保 `DATABASE_URL` 正确：
```env
# 格式: postgresql://用户名:密码@主机:端口/数据库名
DATABASE_URL=postgresql://postgres:password@localhost:5432/alpha_radar
```

### Q: OpenAI API 报错？

**A:** 检查：
1. API Key 是否正确（sk-proj- 开头）
2. 账户是否有余额
3. API Key 是否有使用限制

测试 API Key：
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Q: 爬虫没有数据？

**A:** 
```bash
# 1. 手动测试爬虫
npm run crawler

# 2. 查看日志
# 如果某些源失败是正常的（API限制、网络问题）

# 3. 检查数据库
psql -d alpha_radar -c "SELECT COUNT(*) FROM signals;"
```

### Q: 前端显示空白？

**A:** 
```bash
# 1. 确保 API 服务器运行
curl http://localhost:8000/api/health

# 2. 检查环境变量
# .env 中应该有:
NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. 重新构建
npm run build
npm start
```

### Q: Telegram Bot 不响应？

**A:** 
```bash
# 1. 检查 Bot Token
# 在 Telegram 中与 @BotFather 对话获取

# 2. 测试连接
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# 3. 获取 Chat ID
# 给 Bot 发送消息后访问:
curl https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```

---

## 📈 下一步

项目运行后：

### 1. 查看仪表盘
- 访问 http://localhost:3000
- 探索实时信号
- 尝试不同的筛选条件

### 2. 配置 Telegram 推送
- 创建 Bot: 与 @BotFather 对话
- 获取 Chat ID: 与 @userinfobot 对话
- 配置 `.env`
- 启动 Bot: `npm run telegram-bot`

### 3. 自定义设置
- 调整评分权重: `backend/ai_engine/signal_processor.py`
- 添加新数据源: `backend/crawler/index.js`
- 修改 UI: `app/components/`

### 4. 部署到生产环境
- 阅读 `DEPLOYMENT.md`
- 选择云平台 (Vercel, Railway, AWS)
- 配置 HTTPS 和域名

---

## 📚 资源链接

- 📖 完整文档: [README.md](README.md)
- 🚀 部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📁 项目结构: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- 💬 社区支持: [GitHub Discussions](#)

---

## 🆘 获取帮助

遇到问题？

1. **查看文档**: 先看 README.md 和 DEPLOYMENT.md
2. **运行测试**: `node scripts/test_system.js`
3. **查看日志**: `pm2 logs` 或 `docker-compose logs`
4. **搜索 Issues**: GitHub Issues 页面
5. **提问**: 在 Discussions 中发帖

---

## ⚡ 性能建议

### 开发环境
- 使用 SQLite 代替 PostgreSQL (更轻量)
- 减少爬虫频率: `*/60 * * * *` (每小时)
- 限制信号数量: 只保留最近24小时

### 生产环境
- 使用 Redis 缓存 API 响应
- 配置 CDN 加速前端资源
- 使用 PM2 cluster 模式
- 配置 Nginx 反向代理

---

## 🎉 完成！

现在你已经成功启动了 Alpha Radar！

访问 **http://localhost:3000** 开始你的加密情报之旅 🚀

---

**祝你找到 Alpha！** 📈✨

