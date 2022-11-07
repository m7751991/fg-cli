const inquirer = require("inquirer");
const semver = require("semver");
const pkg = require("../../../package.json").packages;
const fs = require("fs-extra");
const path = require("path");

const packages = path.resolve(__dirname, "../../../packages");

async function Index() {
  const packageInfo = await getProjectInformation();
  const packagesList = Object.keys(packageInfo);
  console.log(packagesList);
  const result = await inquirer.prompt([
    {
      type: "checkbox",
      name: "result",
      choices: packagesList,
      message: "请选择要更新版本号的项目",
    },
  ]);
  console.log(result);
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
