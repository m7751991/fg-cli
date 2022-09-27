const fs = require("fs");
const inquirer = require("inquirer");
const log = require("npmlog");
const home = require("user-home");
const Package = require("./Package");
const templateName = "@fg/vuetemplate";
const templateVersion = "1.0.0";

const init = async (params) => {
  console.log("我是init函数", params);
  const projectPath = process.cwd() + "/params";
  const ex = fs.existsSync(projectPath);
  console.log(ex, "ex????");
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
    const userHome = home + "/.fgcli/template";
    const package = new Package({
      targetPath: userHome,
      name: templateName,
      version: templateVersion,
    });
    const templatePath = package.dirIsEmpty();
    if (!templatePath) {
      package.install();
    }
  }
};

module.exports = {
  init,
};
