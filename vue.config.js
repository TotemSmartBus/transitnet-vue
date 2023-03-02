//Vue.config.js
module.exports = {
    //For server, path of the project
    publicPath: process.env.NODE_ENV === 'production' ? '/bus/' : '/',
    
    // outputDir: 
    productionSourceMap: false,
    devServer: {
        port: 8085,
        open: true,
        https: false,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8090',
                changeOrigin: true,
                pathRewrite: {
                    // '^/api': ''
                }
            }
        }
    }
}