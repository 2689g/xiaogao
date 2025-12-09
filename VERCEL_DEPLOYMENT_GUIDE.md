# Vercel 部署指南

## 项目概述

这是一个基于 Vercel 平台的智能客服助手应用，包含：
- 前端：基于 HTML、JavaScript 和 Tailwind CSS 的单页应用
- 后端：Vercel Serverless Functions 提供知识库读取和 AI 对话转发功能

## 项目结构

```
├── index.html              # 主应用页面
├── README.md               # 项目说明文档
├── vercel.json             # Vercel 配置文件
├── api/                    # 后端 API 目录
│   ├── knowledge-base.js   # 知识库读取 API
│   └── chat.js             # AI 对话转发 API
└── knowledge-base/         # 内置知识库文件目录
    ├── AI生图工作流.pdf
    ├── PS生成器使用说明.pdf
    └── ...（其他知识库文件）
```

## 部署步骤

### 1. 准备工作

- 确保已安装 Git
- 注册/登录 Vercel 账号
- 注册 DeepSeek API 并获取 API Key

### 2. 创建 Git 仓库

```bash
# 初始化 Git 仓库
git init

# 配置用户信息
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加文件到仓库
git add .

# 提交更改
git commit -m "Initial commit"
```

### 3. 部署到 Vercel

#### 方法一：通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel
```

#### 方法二：通过 GitHub/GitLab 部署

1. 将本地仓库推送到 GitHub/GitLab
2. 在 Vercel 控制台中导入项目
3. 配置环境变量

### 4. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `your_deepseek_api_key` | DeepSeek API 密钥 |

### 5. 测试部署

部署成功后，Vercel 会提供一个域名（如 `your-project.vercel.app`）。访问该域名测试应用：

1. 检查内置知识库是否自动加载
2. 尝试上传自定义知识库文件
3. 发送问题进行 AI 对话测试

## 本地开发

由于应用依赖 Vercel Serverless Functions，本地开发需要使用 Vercel CLI：

```bash
# 本地启动开发服务器
vercel dev
```

然后访问 `http://localhost:3000` 测试应用。

## 功能说明

### 前端功能

- 聊天界面：与 AI 助手进行对话
- 知识库管理：上传、查看和删除知识库文件
- 内置知识库：自动加载项目中的知识库文件

### 后端 API

#### 1. 知识库读取 API

- **端点**：`/api/knowledge-base`
- **方法**：`GET`
- **功能**：读取内置知识库目录中的所有文件并返回内容
- **响应格式**：
  ```json
  {
    "success": true,
    "data": [
      {
        "filename": "example.pdf",
        "content": "文件内容...",
        "screenshots": [],
        "size": 12345,
        "uploadTime": "2024-01-01 12:00:00"
      }
    ]
  }
  ```

#### 2. AI 对话转发 API

- **端点**：`/api/chat`
- **方法**：`POST`
- **功能**：转发用户请求到 DeepSeek API 并返回结果
- **请求格式**：
  ```json
  {
    "prompt": "用户问题",
    "knowledgeBase": [...],
    "conversationHistory": [...]
  }
  ```
- **响应格式**：
  ```json
  {
    "success": true,
    "data": {
      "response": "AI 回复内容"
    }
  }
  ```

## 故障排除

### 1. 知识库加载失败

- 检查 `knowledge-base` 目录是否存在且包含文件
- 检查文件权限是否正确

### 2. AI 对话无响应

- 检查 DeepSeek API Key 是否正确配置
- 检查 Vercel 项目日志中的错误信息

### 3. 本地开发问题

- 确保使用 `vercel dev` 而不是直接在浏览器中打开 HTML 文件
- 检查 Node.js 版本是否符合要求（建议使用 Node.js 14+）

## 更新日志

### v1.0.0
- 实现前端聊天界面
- 添加知识库上传和管理功能
- 实现后端 API 用于知识库读取和 AI 对话转发
- 支持部署到 Vercel 平台