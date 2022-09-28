const path = require("path");
const fs = require("fs");
const ora = require("ora");
const log = require("npmlog");
const home = require("user-home");
const inquirer = require("inquirer");
const Package = require("./Package");
const { getLatestVersion } = require("@m7751991/utils");
const CatchPath = "./.fgcli/template";
const TemplateName = "@m7751991/vuetemplate";
const UserCatchPath = path.resolve(home, CatchPath);

const init = async (params) => {
  const projectPath = process.cwd() + "/params";
  const ex = fs.existsSync(projectPath);
  if (ex) {
    const result = await inquirer.prompt([
      {
        type: "confirm",
        name: "isEmpty",
        message: "当前目录已经存在是否覆盖创建？",
      },
    ]);
    if (result.isEmpty) {
      log.info("正在创建....");
    }
  } else {
    try {
      const spinner = ora("start...").start();
      const TemplateVersion = await getLatestVersion(TemplateName);
      const package = new Package({
        targetPath: UserCatchPath,
        name: TemplateName,
        version: TemplateVersion,
      });
      //  没有安装过则install，安装过则更新
      if (!(await package.exists())) {
        const res = await package.install();
        !!res ? spinner.fail("安装失败") : spinner.succeed("安装成功");
      } else {
        log.info("检查模板更新");
        const message = await package.update();
        log.info(message);
        spinner.stop();
      }
    } catch (error) {
      log.error(error);
    }
  }
};

module.exports = {
  init,
};
