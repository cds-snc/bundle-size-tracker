import { buildSizesPath } from "./buildSizesPath";
import { getFile } from "./getFile";
import { cleanup } from "./checkout";

export const readFileSizeData = async name => {
  const packageData = await getFile(buildSizesPath(name));
  const result = JSON.parse(packageData);
  console.log("build-sizes.json", result);
  cleanup(tmpPath, name);
  return result;
};
