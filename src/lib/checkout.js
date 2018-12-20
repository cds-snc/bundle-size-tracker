const { spawnSync } = require("child_process");

export const checkout = async (dir, fullName, sha) => {
  const name = fullName.split("/")[1];

  const cleanup = spawnSync("rm", ["-rf", name], {
    cwd: dir
  });
  if (cleanup.stderr.toString()) {
    console.log(cleanup.stderr.toString());
    return false;
  }

  const clone = spawnSync(
    "git",
    ["clone", `https://github.com/${fullName}`, "--quiet"],
    {
      cwd: dir
    }
  );
  if (clone.stderr.toString()) {
    console.log(clone.stderr.toString());
    return false;
  }

  const checkout = spawnSync("git", ["checkout", sha, "--quiet"], {
    cwd: `${dir}/${name}`
  });
  if (checkout.stderr.toString()) {
    console.log(checkout.stderr.toString());
    return false;
  }
};
