const path = require("path");
const fs = require("fs-extra");
const ora = require("ora");
const log = require("npmlog");
const semver = require("semver");
const home = require("user-home");
const inquirer = require("inquirer");
const Package = require("./Package");
const pathExists = require("path-exists").sync;
const { getLatestVersion, ejs } = require("@m7751991/utils");
const pkg = require("../package.json");
const Service = require("./Service");

const CatchPath = "./.fgcli/template";
const TemplateName = "@m7751991/vuetemplate";
const UserCatchPath = path.resolve(home, CatchPath);

async function core(params) {
  try {
    const result = await prepare();
    init(params);
  } catch (e) {
    log.error(e);
  }
}

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
      await createProject(projectPath, params);
    }
  } else {
    await createProject(projectPath, params);
  }
};

async function prepare() {
  checkPkgVersion();
  checkUerHome();
}

function checkPkgVersion() {
  log.notice("cli", pkg.version);
}

function checkUerHome() {
  log.info(home);
  if (!home || !pathExists(home)) {
    throw new Error("当前用户主目录不存在");
  }
}

async function createProject(projectPath, packageName) {
  try {
    const spinner = new ora();
    const result = await getInquirerData(packageName);
    spinner.start();
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
    await copyTemplateToTargetPath(package.template_path, projectPath);
    // ejs 模板渲染
    const ejsIgnoreFiles = [
      "**/node_modules/**",
      "**/.git/**",
      "**/.vscode/**",
      "**/.DS_Store",
      "**/index.html",
    ];
    // if (template.ignore) {
    // ejsIgnoreFiles.push(...template.ignore);
    // }
    const ejsData = {
      ...result,
    };
    await ejs(
      projectPath,
      { ejsData: ejsData },
      {
        ignore: ejsIgnoreFiles,
      }
    );
    //todo ejs 模板渲染
    spinner.stop();
  } catch (error) {
    log.error(error);
  }
}

async function getInquirerData(packageName) {
  const result = await inquirer.prompt([
    {
      type: "input",
      name: "packageName",
      message: "请输入项目名称",
      default: packageName,
    },
    {
      type: "input",
      name: "version",
      message: "请输入版本号",
      default: "1.0.0",
      validate: (val) => {
        if (semver.valid(val)) {
          return true;
        }
        return "请输入合法版本号";
      },
    },
    {
      type: "input",
      name: "author",
      message: "请输入author",
      default: "",
    },
    {
      type: "input",
      name: "description",
      message: "请输入项目描述",
      default: "",
    },
  ]);
  return result;
}

function copyTemplateToTargetPath(catchPath, targetPath) {
  return new Promise((resolve, reject) => {
    if (!catchPath || !targetPath) {
      log.error("catchPath/targetPath为空请检查模板复制来源");
      return;
    }
    const templatePath = catchPath + "/template";
    fs.copy(templatePath, targetPath, (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
      log.info("复制成功");
    });
  });
}

module.exports = {
  core,
  Service,
};
