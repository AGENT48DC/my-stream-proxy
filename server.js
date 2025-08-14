const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// Render akan menyediakan port melalui variabel lingkungan PORT
const PORT = process.env.PORT || 3000;

const videoProxy = createProxyMiddleware({
  router: (req) => {
    if (!req.query.url) {
      throw new Error('Query parameter "url" is required.');
    }
    const targetUrl = new URL(req.query.url);
    return targetUrl.origin;
  },
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const targetUrl = new URL(req.query.url);
    return targetUrl.pathname + targetUrl.search;
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error: ' + err.message);
  }
});

app.use('/', videoProxy);

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
