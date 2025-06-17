// server.js
const express = require('express');
const cors = require('cors'); // 新增这行
const app = express();

// 启用 CORS（关键！）
app.use(cors()); // 新增这行

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

// 新加 / 路由
app.get('/', (req, res) => {
  res.send('服务已启动，欢迎访问！');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
