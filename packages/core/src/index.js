#!/usr/bin/env node
const fse = require("fs-extra");
const { program } = require("commander");
const log = require("npmlog");
const inquirer = require("inquirer");
const { init } = require("@fgcli/init");

program.name("fgcli").version("1.0.0");
program.command("init [name]").action(async (obj, options) => {
  const res = await fse.exists(process.cwd());
  console.log(obj);
  if (res) {
    init(obj);
  } else {
    log.error("当前目录不存在");
  }
});
program.parse(process.argv);
