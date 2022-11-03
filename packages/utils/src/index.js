const semver = require("semver");
const axios = require("axios");
const urlJoin = require("url-join");
const ejs = require("./ejs");

function getNpmInfo(npmName) {
  if (!npmName) return null;
  const registryUrl = getDefaultReqistry();
  const url = urlJoin(registryUrl, npmName);
  return axios
    .get(url)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}
const getVersions = async (npmName) => {
  const data = await getNpmInfo(npmName);
  if (data) {
    const versions = Object.keys(data.versions);
    return versions;
  } else {
    return [];
  }
};
const getLatestVersion = async (npmName) => {
  const versions = await getVersions(npmName);
  const lastVersion = versions.sort((a, b) => {
    return semver.gt(b, a) ? 1 : -1;
  });
  return lastVersion[0];
};
function getDefaultReqistry(isOriginal = true) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

function exec(command, args, options) {
  const win32 = process.platform === "win32";

  const cmd = win32 ? "cmd" : command;
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;

  return require("child_process").spawn(cmd, cmdArgs, options || {});
}

module.exports = {
  getVersions,
  getLatestVersion,
  ejs,
  exec,
};
