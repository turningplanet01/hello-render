const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json()); // 添加这行以支持JSON请求

// 连接 MongoDB Atlas
const uri = process.env.DATABASE_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('成功连接到 MongoDB Atlas'))
  .catch(err => console.error('连接 Atlas 失败:', err));

// 定义电影数据模型（对应 sample_mflix.embedded_movies）
const movieSchema = new mongoose.Schema({}, { strict: false }); // strict: false 允许任意字段
const Movie = mongoose.model('Movie', movieSchema, 'embedded_movies');

// 测试数据库连接接口
app.get('/api/db-status', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'ok', message: '成功连接到 MongoDB Atlas' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '连接失败', error: err.message });
  }
});

// 查询所有电影（限制前10条）
app.get('/api/movies', async (req, res) => {
  try {
    const sampleDb = mongoose.connection.useDb('sample_mflix'); // 切换到 sample_mflix 数据库
    const MovieModel = sampleDb.model('Movie', movieSchema, 'embedded_movies');
    const movies = await MovieModel.find().limit(10); // 只取前10条数据
    res.json({ status: 'ok', count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 根据电影标题搜索
app.get('/api/movies/search/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const sampleDb = mongoose.connection.useDb('sample_mflix');
    const MovieModel = sampleDb.model('Movie', movieSchema, 'embedded_movies');
    const movies = await MovieModel.find({ 
      title: { $regex: title, $options: 'i' } // 忽略大小写搜索
    }).limit(5);
    res.json({ status: 'ok', count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 根据类型查询电影
app.get('/api/movies/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const sampleDb = mongoose.connection.useDb('sample_mflix');
    const MovieModel = sampleDb.model('Movie', movieSchema, 'embedded_movies');
    const movies = await MovieModel.find({ 
      genres: { $in: [genre] } // 查找包含该类型的电影
    }).limit(10);
    res.json({ status: 'ok', count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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
