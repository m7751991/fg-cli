const path = require("path");
const { merge } = require("webpack-merge");
//复制静态资源到指定文件夹
const copyWebpackPlugin = require("copy-webpack-plugin");
//压缩html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 压缩 CSS
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//压缩js
const TerserWebpackPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolvePath } = require("../src/utils");

//查看打包的文件大小
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
//生产和开发环境公用配置
const BaseWebpackConfig = require("./webpack.base.conf");
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
//只有生产的包会清除log
const consoleObj = function () {
  if (process.env.NODE_ENV === "production") {
    return {
      // 多进程
      parallel: true,
      //删除注释
      extractComments: false,
      terserOptions: {
        compress: {
          // 生产环境去除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    };
  } else {
    return {
      // 多进程
      parallel: true,
    };
  }
};
module.exports = merge(BaseWebpackConfig, {
  mode: "production",
  output: {
    path: resolvePath("dist"),
    filename: "./js/[name].[chunkhash].js",
    clean: true, // 打包时先清除上次打包文件
  },
  plugins: [
    //静态资源输出到根目录
    new copyWebpackPlugin({
      patterns: [
        {
          from: resolvePath("public"),
          to: resolvePath("dist"), //放到output文件夹下
          globOptions: {
            dot: true,
            gitignore: false,
            ignore: [
              // 配置不用copy的文件
              "**/index.html",
            ],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: resolvePath("/public/index.html"), //用来做模板的html的文件路径
      filename: "index.html", //生成的html的名字
      title: "webpack5的项目配置", //这个就对应上文的title
      inject: "body", //打包出来的那个js文件，放置在生成的body标签内
      minify: {
        collapseWhitespace: true, // 去掉空格
        removeComments: true, // 去掉注释
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.analyMode == "true" ? "server" : "disabled", //这个配置后默认是不会启用这个插件
      generateStatsFile: false, // 是否生成stats.json文件
      statsOptions: { source: false },
    }),
    // new MiniCssExtractPlugin({
    //   filename: "./css/[name].[contenthash:8].css",
    //   chunkFilename: "./css/[name].[contenthash:8].css",
    //   allChunks: true,
    //   ignoreOrder: true,
    // }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(consoleObj()),
    ],
  },
});
