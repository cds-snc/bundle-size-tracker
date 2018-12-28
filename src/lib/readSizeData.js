import path from "path";
import { getFile } from "./getFile";
import { cleanup } from "./checkout";

const tmpPath = process.env.TMP_PATH || "/tmp";
const srcPath = process.env.SRC_PATH || "";

export const getBuildSizesPath = name => {
  let filePath = `${tmpPath}/${name}${srcPath}/build-sizes.json`;
  if (process.env.NODE_ENV === "test") {
    filePath = path.resolve(__dirname, "../__mocks__/build-sizes.json");
  }

  return filePath;
};

export const readFileSizeData = async name => {
  const packageData = await getFile(getBuildSizesPath(name));
  const result = JSON.parse(packageData);
  console.log("build-sizes.json", result);
  cleanup(tmpPath, name);
  return result;
};
