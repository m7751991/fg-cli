const inquirer = require("inquirer");
const semver = require("semver");
// const pkg = require("../../../package.json").packages;
const fs = require("fs-extra");
const path = require("path");
const log = require("npmlog");

const packages = path.resolve(__dirname, "../../../packages");
let packageInfo = {};

async function Index() {
  packageInfo = await getProjectInformation();
  await updateVersion(packageInfo);
}

async function updateVersion() {
  const packagesList = Object.keys(packageInfo);
  const { result } = await inquirer.prompt([
    {
      message: "请选择要更新版本号的项目",
      type: "checkbox",
      name: "result",
      choices: packagesList,
    },
  ]);
  const versionQuestion = await inquirer.prompt([
    {
      message: "请选择升级版本号位数",
      type: "list",
      name: "version",
      choices: ["major", "minor", "patch"],
    },
  ]);
  const setVersion = updateVersion(result);
  setVersion(versionQuestion.version, true);
  const { yes } = await inquirer.prompt([
    {
      message: "是否升级版本号",
      type: "confirm",
      name: "yes",
    },
  ]);
  if (yes) {
    setVersion(versionQuestion.version);
  }
}

function updateVersion(source) {
  return (version, pre) => {
    source.forEach((name) => {
      const package = packageInfo[name];
      const vs = semver.inc(package.version, version);
      const pkg = JSON.parse(fs.readFileSync(package.path, "utf-8"));
      if (pre) {
        log.info(name, `${pkg.version}->${vs}`);
      } else {
        pkg.version = vs;
        fs.writeFileSync(package.path, JSON.stringify(pkg, null, 2) + "\n");
      }
    });
  };
}

async function getProjectInformation() {
  return new Promise((resolve, reject) => {
    const packageInfo = {};
    fs.readdir(packages, (err, files) => {
      if (err) {
        reject(err);
      }
      files.forEach((name) => {
        let subDir = path.resolve(packages, `./${name}/package.json`);
        const pkg = require(subDir);
        let project = {};
        project.projectName = pkg.name;
        project.version = pkg.version;
        project.path = subDir;
        packageInfo[pkg.name] = project;
      });
      resolve(packageInfo);
    });
  });
}
Index();

module.exports = {
  Index,
};
