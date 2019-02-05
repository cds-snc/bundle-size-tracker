// import path from "path";
import { loadLocalConfig } from "./localConfig";

const tmpPath = process.env.TMP_PATH || "/tmp";

export const buildSizesPath = async name => {
  await loadLocalConfig(`${tmpPath}/${name}/.bundle-size-tracker-config`);

  const srcPath = process.env.SRC_PATH || "";

  let filePath = `${tmpPath}/${name}${srcPath}/build-sizes.json`;
  return filePath;
};
