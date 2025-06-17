// server.js
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

// 新加 / 路由
app.get('/', (req, res) => {
  res.send('服务已启动，欢迎访问！');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
