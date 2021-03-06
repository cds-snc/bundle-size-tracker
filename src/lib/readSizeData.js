import { buildSizesPath } from "./buildSizesPath";
import { getFile } from "./getFile";
import { cleanup } from "./checkout";

const tmpPath = process.env.TMP_PATH || "/tmp";

export const readFileSizeData = async name => {
  const packageData = await getFile(await buildSizesPath(name));
  const result = JSON.parse(packageData);
  console.log("build-sizes.json", result);
  cleanup(tmpPath, name);
  return result;
};
