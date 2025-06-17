// server.js
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
