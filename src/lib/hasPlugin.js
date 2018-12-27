import { getFile } from "./getFile";

const getData = async filePath => {
  const packageData = await getFile(filePath);

  if (!packageData) {
    return false;
  }

  return JSON.parse(packageData);
};

export const hasPlugin = async filePath => {
  const packageData = await getData(filePath);
  let exists = false;
  if (
    packageData &&
    packageData.dependencies &&
    packageData.dependencies["cds-size-plugin"]
  ) {
    exists = true;
  }
  return exists;
};
