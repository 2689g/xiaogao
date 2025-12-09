# 企业智能客服机器人 - 小高同学

一个基于DeepSeek-R1模型的网页版智能客服聊天机器人，支持知识库上传和智能问答，界面风格接近豆包，适配企业级报错问题解答场景。

## 功能特性

### 核心功能
- ✨ 豆包风格聊天界面（侧边栏 + 对话区 + 输入区）
- 📚 Word/PDF 知识库上传与解析
- 🤖 基于 DeepSeek-R1 模型的智能问答
- 📝 对话历史记录
- 📱 响应式布局适配 PC / 移动端

### 界面特性
- 现代化UI设计，简洁直观
- 支持快捷指令一键提问
- 聊天气泡设计，提升用户体验
- 知识库文件管理功能

## 快速开始

### 本地测试
1. 克隆或下载项目文件到本地
2. 直接在浏览器中打开 `index.html` 文件
3. 开始与智能客服对话

### 部署到GitHub Pages

#### 步骤1：创建GitHub仓库
1. 打开GitHub，新建仓库（建议仓库名：`enterprise-chatbot`）
2. 勾选 `Initialize this repository with a README`（可选）

#### 步骤2：上传文件

**方式1：网页端上传**
1. 进入仓库 → 点击 `Add file` → `Upload files`
2. 上传 `index.html` 和 `knowledge-base` 文件夹
3. 填写提交信息 → 点击 `Commit changes`

**方式2：Git命令行**
```bash
# 克隆仓库（替换为你的仓库地址）
git clone https://github.com/你的用户名/enterprise-chatbot.git

# 进入仓库目录
cd enterprise-chatbot

# 复制项目文件到仓库
cp -r 本地项目路径/* .

# 提交代码
git add .
git commit -m "Add chatbot and knowledge base"
git push origin main
```

#### 步骤3：开启GitHub Pages
1. 进入仓库 → 点击 `Settings`
2. 左侧菜单选择 `Pages`
3. **Build and deployment** 部分：
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，Folder 选择 `/ (root)`
4. 点击 `Save`，等待1-2分钟即可访问

## 知识库管理

### 添加内置知识库
1. 在 `knowledge-base` 文件夹中添加文件（支持 `.txt`、`.docx`、`.pdf`）
2. 修改 `index.html` 中的 `loadBuiltInKnowledgeBase` 函数，将文件添加到 `knowledgeFiles` 数组
3. 重新部署到GitHub Pages

### 手动上传知识库
1. 点击侧边栏的 "点击上传Word/PDF文件" 区域
2. 选择本地的 `.docx` 或 `.pdf` 文件
3. 系统会自动解析文件内容并加入知识库

**注意**：手动上传的知识库仅保存在浏览器内存中，刷新页面后会丢失。

## 配置说明

### API配置
确保 `API_KEY` 和 `MODEL` 变量已正确设置：
```javascript
const API_KEY = "your-api-key"; // DeepSeek API密钥
const MODEL = "DeepSeek-R1-0528-Qwen3-8B"; // 使用的模型
```

### 跨域配置
项目已配置跨域代理，如遇到跨域问题，可更换为其他代理服务：
```javascript
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // 临时代理
```

## 技术栈

- **前端框架**：纯HTML/CSS/JavaScript（无框架依赖）
- **UI框架**：Tailwind CSS
- **图标库**：Font Awesome
- **PDF解析**：PDF.js
- **Word解析**：Mammoth.js
- **AI模型**：DeepSeek-R1

## 文件结构

```
enterprise-chatbot/
├── index.html          # 核心聊天页面
├── knowledge-base/     # 内置知识库文件夹
│   └── 报错解答.txt     # 示例知识库文件
└── README.md           # 项目说明文档
```

## 注意事项

1. **文件大小限制**：GitHub Pages单文件最大支持25MB，超过需拆分或使用Git LFS
2. **API调用**：确保API密钥有效，避免公开泄露
3. **跨域问题**：免费代理服务可能不稳定，生产环境建议自建代理
4. **知识库更新**：修改知识库文件后需重新提交代码到GitHub

## 功能扩展

### 可扩展功能
- 添加用户认证系统
- 实现知识库分类管理
- 支持图片和其他格式文件
- 添加对话导出功能
- 实现多语言支持

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

如有问题或建议，欢迎提交Issue或Pull Request。