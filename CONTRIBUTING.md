# 🤝 Contributing to Alpha Radar

感谢您对 Alpha Radar 项目的关注！我们欢迎所有形式的贡献。

## 🌟 如何贡献

### 🐛 报告 Bug

1. 检查 [Issues](https://github.com/yourusername/alpha-radar-crypto-intelligence/issues) 确认问题未被报告
2. 创建新的 Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 环境信息（OS, Node.js 版本等）

### ✨ 提交功能请求

1. 检查 [Issues](https://github.com/yourusername/alpha-radar-crypto-intelligence/issues) 确认功能未被请求
2. 创建新的 Issue，包含：
   - 功能描述
   - 使用场景
   - 预期效果
   - 可能的实现方案

### 💻 代码贡献

#### 1. Fork 项目
```bash
# 点击 GitHub 上的 Fork 按钮
# 然后克隆你的 fork
git clone https://github.com/YOUR_USERNAME/alpha-radar-crypto-intelligence.git
cd alpha-radar-crypto-intelligence
```

#### 2. 创建分支
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

#### 3. 安装依赖
```bash
npm install
pip install -r requirements.txt
```

#### 4. 开发
- 遵循现有代码风格
- 添加必要的测试
- 更新文档
- 确保所有测试通过

#### 5. 提交
```bash
git add .
git commit -m "feat: add new feature"
# 或
git commit -m "fix: resolve bug in component"
```

#### 6. 推送并创建 PR
```bash
git push origin feature/your-feature-name
```

## 📋 开发规范

### 🎨 代码风格

- **JavaScript/TypeScript**: 使用 ESLint + Prettier
- **Python**: 遵循 PEP 8
- **CSS**: 使用 Tailwind CSS 类名
- **命名**: 使用有意义的变量和函数名

### 📝 提交信息格式

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**Examples:**
```
feat(crawler): add CoinGecko data source
fix(ui): resolve tag display issue
docs(readme): update installation guide
```

### 🧪 测试

```bash
# 运行前端测试
npm test

# 运行后端测试
npm run test:api

# 运行系统测试
node scripts/test_system.js
```

### 📚 文档

- 更新相关 README 文件
- 添加代码注释
- 更新 API 文档
- 更新部署指南

## 🏗️ 项目结构

```
alpha-radar-crypto-intelligence/
├── 📱 Frontend (Next.js)
│   ├── app/                 # App Router
│   ├── components/          # React 组件
│   └── lib/                 # 工具函数
├── 🔧 Backend (Node.js)
│   ├── api/                 # Express API
│   ├── crawler/             # 数据爬虫
│   ├── ai_engine/           # AI 处理
│   └── telegram/            # Telegram Bot
├── 🛠️ Scripts
│   ├── init_db.js           # 数据库初始化
│   └── test_system.js       # 系统测试
└── 📚 Documentation
    ├── README.md
    ├── QUICKSTART.md
    └── DEPLOYMENT.md
```

## 🎯 贡献领域

### 🚀 高优先级
- [ ] 添加新的数据源
- [ ] 改进 AI 评分算法
- [ ] 优化前端性能
- [ ] 增强错误处理

### 🔧 中等优先级
- [ ] 添加单元测试
- [ ] 改进文档
- [ ] 优化 Docker 配置
- [ ] 添加国际化支持

### 💡 低优先级
- [ ] 添加主题切换
- [ ] 改进移动端体验
- [ ] 添加更多图表类型
- [ ] 优化 SEO

## 🤔 需要帮助？

- 📖 查看 [README](README.md) 了解项目
- 🚀 查看 [快速开始指南](QUICKSTART.md)
- 🐳 查看 [部署指南](DEPLOYMENT.md)
- 💬 在 [Discussions](https://github.com/yourusername/alpha-radar-crypto-intelligence/discussions) 提问

## 📜 行为准则

请遵循以下原则：

- 🤝 **友好**: 保持友善和专业
- 🌍 **包容**: 欢迎不同背景的贡献者
- 📝 **清晰**: 提供清晰的反馈和建议
- 🎯 **专注**: 专注于项目目标

## 🏆 贡献者

感谢所有贡献者！您的贡献让 Alpha Radar 变得更好。

<!-- 这里会自动生成贡献者列表 -->

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

**再次感谢您的贡献！让我们一起构建更好的加密情报系统！** 🚀✨

