const { merge } = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BaseWebpackConfig = require("./webpack.base.conf");
const { resolvePath } = require("../src/utils");

module.exports = merge(BaseWebpackConfig, {
  mode: "development",
  target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
  output: {
    path: resolvePath("dist"),
    filename: "./js/[name].[chunkhash].js",
    clean: true, // 打包时先清除上次打包文件
  },
  target: "web",
  devServer: {
    hot: true, //模块的热替换
    open: true, // 编译结束后自动打开浏览器
    port: 8092, // 设置本地端口号
    host: "localhost", //设置本地url
    // 设置代理，用来解决本地开发跨域问题
    // proxy: {
    //   "/api": {
    //     secure: false,
    //     changeOrigin: true,
    //     target:
    //       "https://www.fastmock.site/mock/88bbb3bb8d6ea3dc8f09431a61ce2e50/mymock_test",
    //     pathRewrite: { "^/api": "" },
    //   },
    // },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath("public/index.html"), //用来做模板的html的文件路径
      filename: "index.html", //生成的html的名字
      title: "webpack5的项目配置", //这个就对应上文的title
      inject: "body", //打包出来的那个js文件，放置在生成的body标签内
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    runtimeChunk: "single",
  },
});
