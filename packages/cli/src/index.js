#!/usr/bin/env node
const log = require("npmlog");
const fse = require("fs-extra");
const inquirer = require("inquirer");
const { program } = require("commander");
const spawn = require("child_process").spawnSync;

const { defaultBranch } = require("./env");
const { core } = require("./core");
const pkg = require("../package.json");

function checkNodeVersion() {
  // process.version
  log.info("node version: " + process.version);
}

checkNodeVersion();
program.name("fgcli").version(pkg.version);
program.command("init [name]").action(async (obj, options) => {
  const res = await fse.exists(process.cwd());
  log.info(obj);
  if (res) {
    core(obj);
  } else {
    log.error("当前目录不存在");
  }
});
program
  .command("merge")
  .option("-p --push", "合并之后自动推送到远端")
  .option("-t --target <target>", "指定合并分支名称")
  .description("自动合并分支")
  .action(async (value, options) => {
    console.log(value);
    //获取当前分支名称
    const branchName = spawn("git", [
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    ]).stdout.toString();

    let targetBranch = value.target || defaultBranch.target;
    log.info("提示：", `当前所在分支${branchName}合并目标分支${targetBranch}`);
    if (targetBranch === branchName) {
      log.error("branchName与targetBranch名称相同，请检查当前所在分支");
      return;
    }

    const result = await inquirer.prompt([
      {
        type: "confirm",
        name: "result",
        message: `是否要把${branchName}分支合并到${targetBranch}`,
      },
    ]);
    if (!result) {
      return;
    }
    // // 切换到目标分支
    const checkout = spawn("git", [
      "checkout",
      "-q",
      targetBranch,
    ]).stdout.toString();
    log.info("checkout", checkout);
    const status = spawn("git", ["status"]).stdout.toString();
    log.info(status);
    // // 合并分支
    log.infor(`正在合并${branchName}到${targetBranch}`);
    const merge = spawn("git", ["merge", branchName]).stdout.toString();
    console.log(merge, "git merge");
  });

program.parse(process.argv);
