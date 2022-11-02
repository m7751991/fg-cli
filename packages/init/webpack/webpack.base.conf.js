const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const { resolvePath } = require("../src/utils");
//打包友好提示
// const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const envMode = process.env.envMode;
require("dotenv").config({ path: `.env` });
require("dotenv").config({ path: `.env.${envMode}` });

// 正则匹配以 VUE_APP_ 开头的 变量
const prefixRE = /^VUE_APP_/;
let env = {};
// 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
for (const key in process.env) {
  if (key == "NODE_ENV" || key == "BASE_URL" || prefixRE.test(key)) {
    env[key] = JSON.stringify(process.env[key]);
  }
}

module.exports = {
  entry: resolvePath("src/main.js"), // 入口
  output: {
    assetModuleFilename: "assets/images/[contenthash][ext]", //自定义asset module资源打包后的路径和名字
  },
  stats: "errors-only",
  resolve: {
    alias: {
      "@": resolvePath("src"),
      "@components": resolvePath("src/components"),
      "@assets": resolvePath("src/assets"),
      "@img": resolvePath("src/assets/img"),
      "@utils": resolvePath("src/utils"),
      "@api": resolvePath("src/api"),
      "@css": resolvePath("src/assets/css"),
      "@plugins": resolvePath("src/plugins"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset", // asset 资源类型可以根据指定的图片大小来判断是否需要将图片转化为 base64
        generator: {
          filename: "assets/images/[hash][ext][query]", // 局部指定输出位置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024, // 限制于 60kb
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|)$/,
        type: "asset/resource",
        generator: {
          // 输出文件位置以及文件名
          filename: "assets/fonts/[hash:8].[name][ext]",
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-runtime"]],
            //开启缓存
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // 定义环境和变量
      "process.env": {
        ...env,
      },
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new VueLoaderPlugin(),

    // new FriendlyErrorsWebpackPlugin({
    //   // 成功的时候输出
    //   compilationSuccessInfo: {
    //     messages: [`已经编译打包成功啦~`]
    //   },
    //   // 是否每次都清空控制台
    //   clearConsole: true
    // })
  ],
  optimization: {
    nodeEnv: false,
  },
};
