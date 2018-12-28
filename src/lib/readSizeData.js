import { buildSizesPath } from "./buildSizesPath";
import { getFile } from "./getFile";

export const readFileSizeData = async name => {
  const packageData = await getFile(buildSizesPath(name));
  const result = JSON.parse(packageData);
  console.log("build-sizes.json", result);
  return result;
};
