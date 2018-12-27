import { checkout } from "./checkout";
import { hasPlugin } from "./hasPlugin";

const { spawnSync } = require("child_process");

const tmpPath = process.env.TMP_PATH || "/tmp";
const srcPath = process.env.SRC_PATH || "";

const pluginCheck = async name => {
  // Use if your package.json is in a different location than root ex: /the-app
  const filePath = `${tmpPath}/${name}${srcPath}/package.json`;

  if (filePath && !(await hasPlugin(filePath))) {
    throw new Error("size-plugin not found");
  }

  console.log("found size plugin");
};

const runInstall = name => {
  console.log("npm install");
  const install = spawnSync("npm", ["install"], {
    cwd: `${tmpPath}/${name}${srcPath}/`
  });

  if (install.stderr.toString()) {
    console.log(install.stderr.toString());
  }
};

const runBuild = name => {
  console.log("running build");

  const build = spawnSync("npm", ["run", "build"], {
    cwd: `${tmpPath}/${name}${srcPath}/`
  });

  if (build.stderr.toString()) {
    console.log(build.stderr.toString());
  }
};

export const build = async ({ name, fullName, after }) => {
  if (await !checkout(tmpPath, fullName, after)) {
    throw new Error(`${fullName} failed to checkout`);
  }

  await pluginCheck(name);
  runInstall(name);
  runBuild(name);
};
