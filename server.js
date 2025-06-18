const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 新增

const app = express();
app.use(cors());

// 连接 MongoDB Atlas
const uri = process.env.DATABASE_URL; // 你在 Environment Variables 里配置的 URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('成功连接到 MongoDB Atlas'))
  .catch(err => console.error('连接 Atlas 失败:', err));

// 测试数据库连接接口
app.get('/api/db-status', async (req, res) => {
  try {
    // ping 命令测试连接
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'ok', message: '成功连接到 MongoDB Atlas' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '连接失败', error: err.message });
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello render world' });
});

app.get('/', (req, res) => {
  res.send('Service started. Welcome！');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
