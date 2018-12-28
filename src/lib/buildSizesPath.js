// import path from "path";
const tmpPath = process.env.TMP_PATH || "/tmp";
const srcPath = process.env.SRC_PATH || "";

export const buildSizesPath = name => {
  let filePath = `${tmpPath}/${name}${srcPath}/build-sizes.json`;
  return filePath;
};
