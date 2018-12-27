import path from "path";
import { getFile } from "./getFile";

const tmpPath = process.env.TMP_PATH || "/tmp";
const srcPath = process.env.SRC_PATH || "";

export const readFileSizeData = async name => {
  let filePath = `${tmpPath}/${name}${srcPath}/build-sizes.json`;
  if (process.env.NODE_ENV === "test") {
    filePath = path.resolve(__dirname, "../__mocks__/build-sizes.json");
  }

  const packageData = await getFile(filePath);
  const result = JSON.parse(packageData);
  console.log("build-sizes.json", result);
  return result;
};
