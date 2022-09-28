const path = require("path");
const fs = require("fs-extra");
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
  const projectPath = process.cwd() + "/" + params;
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
      const spinner = ora().start();
      await createProject(projectPath);
      spinner.stop();
    }
  } else {
    const spinner = ora().start();
    await createProject(projectPath);
    spinner.stop();
  }
};

async function createProject(projectPath) {
  try {
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
    }
    copyTemplateToTargetPath(package.template_path, projectPath);
  } catch (error) {
    log.error(error);
  }
}

function copyTemplateToTargetPath(catchPath, targetPath) {
  if (!catchPath || !targetPath) {
    log.error("catchPath/targetPath为空请检查模板复制来源");
    return;
  }
  const templatePath = catchPath + "/template";
  fs.copy(templatePath, targetPath, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    log.info("复制成功");
  });
}

module.exports = {
  init,
};
