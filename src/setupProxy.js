const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/realtime', createProxyMiddleware({ target: 'http://api.irishrail.ie', changeOrigin: true }));
 };
