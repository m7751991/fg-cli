const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const webpackDev = require("../webpack/webpack.dev.conf");
const webpackProd = require("../webpack/webpack.prod.conf");
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
      const compiler = webpack(config);
      const server = config.devServer;
      const devServer = new WebpackDevServer(compiler, server);
      // 启动服务.
      devServer.listen(server.port, server.host, (_e) => {
        if (_e) {
          console.log(_e);
          return;
        }
        console.log("开发服务器启动中...");
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
