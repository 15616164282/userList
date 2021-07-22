
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/", //./
  outputDir: "hbd",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
    https: false,
    port: 8088,
    proxy: {
      "/api": {
        target: "http://192.168.1.113:8888",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },

    },
  },
  chainWebpack: (config) => {
    config.entry("main").add("babel-polyfill");
  },
  configureWebpack: (config) => {
    return {

      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
        }
      }
    }
  }
};
