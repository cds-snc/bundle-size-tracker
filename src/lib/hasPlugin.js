import { getFile } from "./getFile";

const getData = async filePath => {
  const packageData = await getFile(filePath);

  if (!packageData) {
    return false;
  }

  return JSON.parse(packageData);
};

const pluginName = "cds-size-plugin";

export const hasPlugin = async filePath => {
  const packageData = await getData(filePath);
  let exists = false;

  if (!packageData) return exists;

  let hasDevDep =
    packageData.devDependencies && packageData.devDependencies[pluginName];

  let hasDep = packageData.dependencies && packageData.dependencies[pluginName];

  if (hasDevDep || hasDep) {
    exists = true;
  }
  return exists;
};
