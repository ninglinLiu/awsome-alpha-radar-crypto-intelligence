# 🚀 Alpha Radar 部署指南

完整的生产环境部署文档

---

## 📋 目录

1. [系统要求](#系统要求)
2. [本地开发部署](#本地开发部署)
3. [Docker 部署](#docker-部署)
4. [云平台部署](#云平台部署)
5. [生产环境优化](#生产环境优化)
6. [监控与维护](#监控与维护)
7. [故障排除](#故障排除)

---

## 系统要求

### 最低配置
- CPU: 2 核
- 内存: 4GB RAM
- 存储: 20GB SSD
- 网络: 10Mbps

### 推荐配置
- CPU: 4 核
- 内存: 8GB RAM
- 存储: 50GB SSD
- 网络: 100Mbps

### 软件依赖
- Node.js 18+
- Python 3.9+
- PostgreSQL 15+
- Nginx (可选，用于反向代理)

---

## 本地开发部署

### 1. 环境准备

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Python
sudo apt-get install python3.9 python3-pip

# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

### 2. 数据库设置

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE alpha_radar;
CREATE USER alphauser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE alpha_radar TO alphauser;
\q
```

### 3. 项目配置

```bash
# 克隆项目
git clone https://github.com/yourusername/alpha-radar.git
cd alpha-radar

# 安装依赖
npm install
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
nano .env
```

### 4. 初始化

```bash
# 初始化数据库
node scripts/init_db.js

# 首次数据采集
npm run crawler

# AI 处理
python backend/ai_engine/batch_processor.py

# 测试系统
node scripts/test_system.js
```

### 5. 启动服务

```bash
# 使用 PM2 管理进程
npm install -g pm2

# 启动所有服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

---

## Docker 部署

### 1. 单机 Docker Compose

```bash
# 创建 .env 文件
cat > .env << EOF
OPENAI_API_KEY=sk-your-key-here
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_CHAT_ID=your-chat-id
EOF

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看状态
docker-compose ps
```

### 2. Docker Swarm (多节点)

```bash
# 初始化 Swarm
docker swarm init

# 部署 Stack
docker stack deploy -c docker-compose.yml alpha-radar

# 查看服务
docker service ls

# 扩容
docker service scale alpha-radar_api=3
```

### 3. Kubernetes

创建 `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alpha-radar-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: alpha-radar-api
  template:
    metadata:
      labels:
        app: alpha-radar-api
    spec:
      containers:
      - name: api
        image: alpharadar/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: alpha-radar-secrets
              key: database-url
```

部署：

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f <pod-name>
```

---

## 云平台部署

### Vercel (前端)

1. 连接 GitHub 仓库
2. 配置构建设置:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. 添加环境变量:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```
4. 部署

**CLI 部署:**

```bash
npm i -g vercel
vercel --prod
```

### Railway (后端 + 数据库)

1. 创建新项目
2. 添加 PostgreSQL 数据库
3. 添加 API 服务:
   - 连接 GitHub 仓库
   - Root Directory: `/`
   - Build Command: `npm install`
   - Start Command: `node backend/api/server.js`
4. 添加 Scheduler 服务:
   - Start Command: `node backend/scheduler/cron_jobs.js`
5. 配置环境变量
6. 部署

### AWS

#### EC2 + RDS

```bash
# 1. 创建 EC2 实例 (Ubuntu 22.04)
# 2. 配置安全组 (开放 3000, 8000 端口)
# 3. 连接到实例

ssh -i your-key.pem ubuntu@your-ec2-ip

# 安装依赖
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs python3-pip nginx

# 克隆项目
git clone https://github.com/yourusername/alpha-radar.git
cd alpha-radar

# 安装依赖
npm install
pip install -r requirements.txt

# 配置环境变量 (RDS 连接字符串)
nano .env

# 初始化
node scripts/init_db.js

# 启动服务
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 配置 Nginx
sudo nano /etc/nginx/sites-available/alpha-radar
```

**Nginx 配置:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/alpha-radar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### DigitalOcean

使用 App Platform:

1. 创建新 App
2. 连接 GitHub 仓库
3. 配置组件:
   - **Frontend**: 
     - Type: Static Site
     - Build Command: `npm run build`
   - **API**: 
     - Type: Web Service
     - Run Command: `node backend/api/server.js`
   - **Database**: 
     - Type: PostgreSQL
4. 配置环境变量
5. 部署

---

## 生产环境优化

### 1. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_signals_score_timestamp ON signals(score DESC, timestamp DESC);
CREATE INDEX idx_signals_tags_gin ON signals USING GIN(tags);

-- 配置连接池
-- postgresql.conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
```

### 2. 缓存策略

使用 Redis 缓存:

```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// 缓存 API 响应
app.get('/api/signals', async (req, res) => {
  const cacheKey = `signals:${JSON.stringify(req.query)}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const data = await fetchSignals(req.query);
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5分钟缓存
  res.json(data);
});
```

### 3. 负载均衡

使用 Nginx:

```nginx
upstream alpha_api {
    least_conn;
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}

server {
    location /api {
        proxy_pass http://alpha_api;
    }
}
```

### 4. 日志管理

```javascript
// 使用 Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 5. 自动备份

```bash
# 创建备份脚本
cat > /usr/local/bin/backup-alpha-radar.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/alpha-radar"
DATE=$(date +%Y%m%d_%H%M%S)

# 数据库备份
pg_dump -U alphauser alpha_radar | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# 保留最近7天的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-alpha-radar.sh

# 添加到 crontab (每天凌晨2点)
crontab -e
0 2 * * * /usr/local/bin/backup-alpha-radar.sh
```

---

## 监控与维护

### 1. 健康检查

```javascript
// healthcheck.js
const axios = require('axios');

async function healthCheck() {
  const services = [
    { name: 'API', url: 'http://localhost:8000/api/health' },
    { name: 'Frontend', url: 'http://localhost:3000' },
  ];

  for (const service of services) {
    try {
      await axios.get(service.url, { timeout: 5000 });
      console.log(`✅ ${service.name} is healthy`);
    } catch (error) {
      console.error(`❌ ${service.name} is down!`);
      // 发送告警通知
    }
  }
}

setInterval(healthCheck, 60000); // 每分钟检查
```

### 2. 性能监控

使用 PM2 Plus:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# 查看实时监控
pm2 monit
```

### 3. 错误追踪

集成 Sentry:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// 错误捕获
app.use(Sentry.Handlers.errorHandler());
```

---

## 故障排除

### 数据库连接失败

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 检查连接
psql -U alphauser -d alpha_radar -h localhost

# 查看日志
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### API 响应缓慢

```bash
# 查看系统资源
htop
free -h
df -h

# 检查数据库查询
SELECT * FROM pg_stat_activity WHERE state = 'active';

# 分析慢查询
EXPLAIN ANALYZE SELECT * FROM signals ORDER BY score DESC LIMIT 50;
```

### 爬虫失败

```bash
# 手动测试爬虫
npm run crawler

# 查看日志
pm2 logs alpha-scheduler --lines 100

# 检查网络
curl -I https://www.binance.com
```

### 内存溢出

```bash
# 限制 Node.js 内存
node --max-old-space-size=4096 backend/api/server.js

# PM2 配置
pm2 start backend/api/server.js --max-memory-restart 1G
```

---

## 安全建议

1. **使用 HTTPS**: 配置 SSL/TLS 证书 (Let's Encrypt)
2. **环境变量**: 不要提交 `.env` 到 Git
3. **API 限流**: 使用 `express-rate-limit`
4. **CORS 配置**: 仅允许信任的域名
5. **定期更新**: 保持依赖包最新

```javascript
// API 限流
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 最多100个请求
});

app.use('/api/', limiter);
```

---

## 联系支持

遇到问题？联系我们：

- 📧 Email: support@alpharadar.io
- 💬 Discord: [Alpha Radar Community](#)
- 📖 Documentation: [docs.alpharadar.io](#)

---

**祝部署顺利！🚀**

