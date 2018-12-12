const { spawnSync } = require("child_process");

module.exports.checkoutRepo = async name => {
  await require("lambda-git");
  const clone = spawnSync("git", ["clone", name, "--quiet"], {
    cwd: "/tmp"
  });
  if (clone.stderr.toString()) {
    return false;
  } else {
    return true;
  }
};
