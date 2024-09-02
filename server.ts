const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});

app.use('/api', createProxyMiddleware({
    target: 'https://news.ycombinator.com/',
    changeOrigin: true,
    pathRewrite: {'^/api' : ''}
})
);

app.listen(4000, () => {
    console.log("Server is up at port: 4000")
});