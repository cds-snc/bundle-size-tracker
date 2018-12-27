import { checkout } from "./checkout";
import { hasPlugin } from "./hasPlugin";
import md5File from "md5-file/promise";

const { spawnSync } = require("child_process");

export const build = async ({ name, fullName, after, previousMaster = {} }) => {
  // checkout the repo
  const tmpPath = process.env.TMP_PATH || "/tmp";
  if (await !checkout(tmpPath, fullName, after)) {
    throw new Error(`${fullName} failed to checkout`);
  }

  // Use if your package.json is in a different location than root ex: /the-app
  const srcPath = process.env.SRC_PATH || "";

  const filePath = `${tmpPath}/${name}${srcPath}/package.json`;

  const md5str = await md5File(filePath);

  if (previousMaster && previousMaster.md5str === md5str) {
    // no need to build
    console.log("md5 matches current");
    return true;
  }

  if (filePath && !(await hasPlugin(filePath))) {
    throw new Error("size-plugin not found");
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
  return md5str;
};
