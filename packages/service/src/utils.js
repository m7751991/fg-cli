const path = require("path");

const base = process.cwd();
const resolvePath = (url) => {
  return path.resolve(base, "./", url);
};

module.exports = {
  resolvePath,
};
