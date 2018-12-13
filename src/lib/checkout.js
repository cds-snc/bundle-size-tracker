const { spawnSync } = require("child_process");

module.exports.checkoutRepo = async (dir, fullName, sha) => {
  await require("lambda-git");
  const clone = spawnSync(
    "git",
    ["clone", `https://github.com/${fullName}`, "--quiet"],
    {
      cwd: dir
    }
  );
  if (clone.stderr.toString()) {
    return false;
  }
};
