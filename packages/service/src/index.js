#!/usr/bin/env node
const log = require("npmlog");
const { program } = require("commander");
const Service = require("./Service");
const pkg = require("../package.json");

function checkNodeVersion() {
  // process.version
  log.info("node version: " + process.version);
}

checkNodeVersion();
program.name("fgcli-service").version(pkg.version);

program.command("dev").action(async (obj, options) => {
  const modes = "development";
  const service = new Service(process.cwd(), { modes });
  service.run();
});
program.command("build").action(async (obj, options) => {
  const modes = "prod";
  const service = new Service(process.cwd(), { modes });
  service.run();
});

program.parse(process.argv);
