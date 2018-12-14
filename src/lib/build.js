import { checkout } from "./checkout";
import { hasPlugin } from "./hasPlugin";

const { spawnSync } = require("child_process");

export const build = async ({ name, fullName, after }) => {
  // checkout the repo
  const tmpPath = process.env.TMP_PATH || "/tmp";
  if (await !checkout(tmpPath, fullName, after)) {
    throw new Error(`${fullName} failed to checkout`);
  }

  // Use if your package.json is in a different location than root ex: /the-app
  const buildPath = process.env.BUILD_PATH || "";

  const filePath = `${tmpPath}/${name}${buildPath}/package.json`;
  if (filePath && !hasPlugin(filePath)) {
    throw new Error("plugin not found");
  }

  const install = spawnSync("npm", ["install"], {
    cwd: `${tmpPath}/${name}${buildPath}/`
  });

  if (install.stderr.toString()) {
    throw new Error(install.stderr.toString());
  }

  const build = spawnSync("npm", ["run", "build"], {
    cwd: `${tmpPath}/${name}${buildPath}/`
  });

  if (build.stderr.toString()) {
    throw new Error(build.stderr.toString());
  }

  // Get information from build
  return true;
};
