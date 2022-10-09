#!/usr/bin/env node
const fse = require("fs-extra");
const { program } = require("commander");
const log = require("npmlog");
const { core } = require("@m7751991/init");
const pkg = require("../../../package.json");
const spawn = require("child_process").spawnSync;
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
program.command("dev").action(async (obj, options) => {});
program.command("build").action(async (obj, options) => {});
program
  .command("merge")
  .option("-p --push", "合并之后自动推送到远端")
  .option("-l --list <list...>", "合并分支名称", ["321"])
  .description("自动合并分支")
  .action(async (value, options) => {
    //获取当前分支名称
    const branchName = spawn("git", [
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    ]).stdout.toString();
    console.log(branchName);
    console.log(options.opts());
    const opts = options.opts();
    opts.list.forEach((b) => {
      // // 切换到目标分支
      const checkout = spawn("git", ["checkout", "-q", b]).stdout.toString();
      log.info("checkout", checkout);
      const status = spawn("git", ["status"]).stdout.toString();
      console.log(status, "查看状态");
      // // 合并分支
      const merge = spawn("git", ["merge", branchName]).stdout.toString();
      console.log(merge, "git merge");
      // log.info("请手动推送到远端");
    });
  });
program.parse(process.argv);
