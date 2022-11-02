const webpackDev = require("../webpack/webpack.dev.conf");
const webpackProd = require("../webpack/webpack.prod.conf");
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
class Service {
  constructor(context, { modes }) {
    process.VUE_CLI_SERVICE = this;
    // this.pkg = this.resolvePkg(pkg);
    this.modes = modes;
    this.context = context;
    this.webpackConfig = {};
  }
  init() {}
  async run() {
    const config = webpackDev;
    try {
      console.log(config, "开发");
      const compiler = webpack(config);
      //   compiler.run((error, stats) => {
      //     // console.log(stats);
      //     if (error) console.log(error);
      //   });
      const server = config.devServer;
      const devServer = new WebpackDevServer(compiler, server);
      // 启动服务.
      devServer.listen(server.port, server.host, (_e) => {
        if (_e) {
          console.log(_e);
          return;
        }
        console.log(chalk.cyan("开发服务器启动中...\n"));
      });

      ["SIGINT", "SIGTERM"].forEach((sig) => {
        process.on(sig, () => {
          console.log("\n devserver " + sig);
          devServer.close();
          process.exit();
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Service;
