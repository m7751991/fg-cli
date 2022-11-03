const path = require("path");
const fse = require("fs-extra");
const semver = require("semver");
const npminstall = require("npminstall");
const pathExists = require("path-exists").sync;
const { getLatestVersion } = require("@m7751991/utils");

class Package {
  constructor(options) {
    this.options = options;
    this.packageName = this.options.name;
    this.packageVersion = this.options.version;
    this.targetPath = this.options.targetPath;
    this.cacheFilePathPrefix = this.packageName.replace("/", "_");
  }
  get template_path() {
    return path.resolve(
      this.targetPath,
      `./node_modules/_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    );
  }
  // 检查目录是否存在，不存在则创建
  async prepare() {
    if (this.targetPath && !pathExists(this.targetPath)) {
      await fse.mkdirpSync(this.targetPath);
    }
  }
  // 检查template是否已经安装过
  async exists() {
    if (this.targetPath) {
      await this.prepare();
      return pathExists(this.template_path);
    }
  }
  async install() {
    return await npminstall({
      root: this.targetPath,
      storeDir: this.targetPath + "/node_modules",
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
      registry: "https://registry.npmjs.org",
    });
  }
  async update() {
    const TemplateVersion = await getLatestVersion(this.packageName);
    if (semver.gt(TemplateVersion, this.packageVersion)) {
      this.packageVersion = TemplateVersion;
      const res = await this.install();
      return res ? "更新失败" : "更新模板成功";
    }
    return "当前是最新版本";
  }
}

module.exports = Package;
