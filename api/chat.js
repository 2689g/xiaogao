const fetch = require('node-fetch');

// API Configuration
const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-pM2ZfREbehcfwgm12cEeB5FdA2E1408c87E9B5E0319cB947'; // 使用环境变量或默认值
const MODEL = 'DeepSeek-R1-0528-Qwen3-8B'; // DeepSeek Model

module.exports = async (req, res) => {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // 只允许POST请求
    if (req.method !== 'POST') {
      res.status(405).json({
        success: false,
        message: '只允许POST请求'
      });
      return;
    }

    // 验证请求体
    const { prompt, message, knowledgeBase, conversationHistory } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        message: '缺少必要参数: message'
      });
      return;
    }

    // 构建提示词
    let finalPrompt = '';

    if (prompt) {
      // 如果直接提供了完整的prompt，使用它
      finalPrompt = prompt;
    } else {
      // 否则构建prompt
      const knowledgeText = knowledgeBase && knowledgeBase.length
        ? `知识库内容：\n${knowledgeBase.map(item => `【${item.filename}】\n${item.content}`).join('\n\n')}\n\n`
        : '';

      const historyText = conversationHistory && conversationHistory.length
        ? `对话历史：\n${conversationHistory.map(item => `${item.role === 'user' ? '用户' : '助手'}：${item.content}`).join('\n')}\n\n`
        : '';

      const systemPrompt = `你是企业智能客服助手，专门解答报错问题和提供解决方案。
请基于提供的知识库内容和对话历史，准确、简洁地回答用户问题。
如果知识库中有相关内容，优先使用知识库内容回答；如果没有，则基于你的知识回答。
回答要专业、易懂，避免使用过于技术化的术语，必要时提供具体的解决步骤。
当回答与PDF文件相关的内容时，请提及相关的PDF文件并标注页码，给出简要文字概要。`;

      finalPrompt = `${systemPrompt}\n\n${knowledgeText}${historyText}用户当前问题：${message}\n\n助手回答：`;
    }

    // 调用AI API
    const apiUrl = 'https://api.edgefn.net/v1/chat/completions';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: '你是企业智能客服助手，专门解答报错问题和提供解决方案。'
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败：${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // 验证响应数据格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API响应格式不正确');
    }

    // 返回成功响应
    res.status(200).json({
      success: true,
      data: {
        response: data.choices[0].message.content.trim(),
        model: data.model,
        usage: data.usage
      }
    });
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({
      success: false,
      message: '处理请求时出错',
      error: error.message
    });
  }
};