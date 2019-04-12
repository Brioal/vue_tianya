module.exports = {
    lintOnSave: false,
    devServer: {
        port: '8040',
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8041',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    }
};
