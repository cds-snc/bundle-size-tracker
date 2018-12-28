import { checkout } from "./checkout";
import { hasPlugin } from "./hasPlugin";
import { loadLocalConfig } from "./localConfig";
import { notify } from "./index";
const { spawnSync } = require("child_process");

const tmpPath = process.env.TMP_PATH || "/tmp";

const getFullPath = name => {
  const srcPath = process.env.SRC_PATH || "";
  return `${tmpPath}/${name}${srcPath}/`;
};

const pluginCheck = async (name, body, octokit) => {
  const srcPath = process.env.SRC_PATH || "";
  const filePath = `${tmpPath}/${name}${srcPath}/package.json`;

  if (filePath && !(await hasPlugin(filePath))) {
    throw new Error("size-plugin not found");
  }

  await notify(body, octokit, {
    state: "pending",
    description: "found size plugin"
  });
};

const runInstall = async (name, body, octokit) => {
  await notify(body, octokit, {
    state: "pending",
    description: "running install"
  });

  const install = spawnSync("npm", ["--production=false", "install"], {
    cwd: getFullPath(name)
  });

  if (install.stderr.toString()) {
    console.log(install.stderr.toString());
  }
};

const runBuild = async (name, body, octokit) => {
  await notify(body, octokit, {
    state: "pending",
    description: "running build"
  });

  const buildCmd = process.env.BUILD_CMD || "build";

  const build = spawnSync("npm", ["run", buildCmd], {
    cwd: getFullPath(name)
  });

  if (build.stderr.toString()) {
    console.log(build.stderr.toString());
  }
};

export const build = async ({ name, fullName, after }, octokit, body) => {
  if (await !checkout(tmpPath, fullName, after)) {
    throw new Error(`${fullName} failed to checkout`);
  }

  await loadLocalConfig(`${tmpPath}/${name}/.bundle-size-tracker-config`);
  await pluginCheck(name, body, octokit);
  await runInstall(name, body, octokit);
  await runBuild(name, body, octokit);
};
