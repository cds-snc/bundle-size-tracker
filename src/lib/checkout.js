const { spawnSync } = require("child_process");

module.exports.checkoutRepo = async fullName => {
  await require("lambda-git");
  const clone = spawnSync(
    "git",
    ["clone", `https://github.com/${fullName}`, "--quiet"],
    {
      cwd: "/tmp"
    }
  );
  if (clone.stderr.toString()) {
    return false;
  } else {
    return true;
  }
};
