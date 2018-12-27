const { spawnSync } = require("child_process");

const cleanup = (dir, name) => {
  const cleanup = spawnSync("rm", ["-rf", name], {
    cwd: dir
  });
  if (cleanup.stderr.toString()) {
    console.log(cleanup.stderr.toString());
    return false;
  }

  return true;
};

const clone = (dir, fullName) => {
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

  return true;
};

export const checkout = async (dir, fullName, sha) => {
  const name = fullName.split("/")[1];

  if (!cleanup(dir, name) || !clone()) {
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
