const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:9527",
      changeOrigin: true, // 设置跨域请求
    })
  );

  app.use(
    "/public",
    createProxyMiddleware({
      target: "http://localhost:9527",
      changeOrigin: true, // 设置跨域请求
    })
  );
};
