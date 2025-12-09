const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// 知识库目录路径
const knowledgeBasePath = path.join(process.cwd(), 'knowledge-base');

// 获取知识库文件列表
function getKnowledgeFiles() {
  try {
    const files = fs.readdirSync(knowledgeBasePath);
    return files.map(file => ({
      name: file,
      type: file.split('.').pop().toLowerCase(),
      path: `/knowledge-base/${file}`
    }));
  } catch (error) {
    console.error('获取知识库文件列表失败:', error);
    return [];
  }
}

// 解析文本文件
async function parseTextFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('解析文本文件失败:', error);
    throw new Error('解析文本文件失败');
  }
}

// 解析PDF文件
async function parsePDFFile(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text,
      screenshots: [] // 在服务器端不生成截图
    };
  } catch (error) {
    console.error('解析PDF文件失败:', error);
    throw new Error('解析PDF文件失败');
  }
}

// 解析Word文件
async function parseWordFile(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('解析Word文件失败:', error);
    throw new Error('解析Word文件失败');
  }
}

// 主处理函数
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

    const files = getKnowledgeFiles();
    const knowledgeBase = [];

    for (const file of files) {
      try {
        const filePath = path.join(knowledgeBasePath, file.name);
        let content = '';
        let screenshots = [];

        if (file.type === 'text' || file.type === 'txt') {
          content = await parseTextFile(filePath);
        } else if (file.type === 'pdf') {
          const result = await parsePDFFile(filePath);
          content = result.text;
          screenshots = result.screenshots;
        } else if (file.type === 'docx') {
          content = await parseWordFile(filePath);
        }

        // 获取文件大小
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;

        knowledgeBase.push({
          filename: file.name,
          content: content,
          screenshots: screenshots,
          size: fileSizeInBytes,
          uploadTime: stats.mtime.toLocaleString()
        });
      } catch (error) {
        console.error(`处理文件 ${file.name} 失败:`, error);
        // 继续处理其他文件
        continue;
      }
    }

    res.status(200).json({
      success: true,
      data: knowledgeBase
    });
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({
      success: false,
      message: '获取知识库失败',
      error: error.message
    });
  }
};