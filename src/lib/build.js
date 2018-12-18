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
  const srcPath = process.env.SRC_PATH || "";

  const filePath = `${tmpPath}/${name}${srcPath}/package.json`;
  if (filePath && !hasPlugin(filePath)) {
    throw new Error("plugin not found");
  }

  console.log("found size plugin");

  console.log("npm install");
  const install = spawnSync("npm", ["install"], {
    cwd: `${tmpPath}/${name}${srcPath}/`
  });

  if (install.stderr.toString()) {
    console.log(install.stderr.toString());
  }

  console.log("running build");

  const build = spawnSync("npm", ["run", "build"], {
    cwd: `${tmpPath}/${name}${srcPath}/`
  });

  if (build.stderr.toString()) {
    console.log(build.stderr.toString());
  }

  // Get information from build
  return true;
};
