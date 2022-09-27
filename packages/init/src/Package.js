const npminstall = require("npminstall");
const fse = require("fs-extra");
class Package {
  constructor(options) {
    this.options = options;
  }
  get template_store_name() {
    return `_${this.options.name}@${this.options.version}@${this.options.name}`;
  }
  get template_path() {
    return `${this.options.targetPath}/node_modules/${this.template_store_name}`;
  }
  async dirIsEmpty() {
    const res = await fse.ensureDir(this.options.targetPath);
    const templatePath = fse.existsSync(this.template_path);
    return templatePath;
  }
  async install() {
    this.dirIsEmpty();
    const res = await npminstall({
      root: this.options.targetPath,
      storeDir: this.options.targetPath + "/node_modules",
      pkgs: [{ name: "foo", version: "~1.0.0" }],
      registry: "https://registry.npmjs.org",
    });
    console.log(res, "?resss");
  }
  update() {}
}

module.exports = Package;
