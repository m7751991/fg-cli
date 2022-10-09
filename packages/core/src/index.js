#!/usr/bin/env node
const fse = require("fs-extra");
const { program } = require("commander");
const log = require("npmlog");
const { core } = require("@m7751991/init");
const pkg = require("../../../package.json");
const spawn = require("child_process").spawn;
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
program.command("merge").action(async (obj, options) => {
  const child = spawn("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  child.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  child.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});
program.parse(process.argv);
