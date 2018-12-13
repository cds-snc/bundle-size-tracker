import { getFile } from "./getFile";

const log = e => {
  if (process.env.NODE_ENV !== "test") {
    console.log(e.message);
  }
};

const getData = async filePath => {
  const packageData = await getFile(filePath);

  if (!packageData) {
    return false;
  }

  return JSON.parse(packageData);
};

export const hasPlugin = async filePath => {
  try {
    const packageData = await getData(filePath);
    let exists = false;
    if (
      packageData &&
      packageData.devDependencies &&
      packageData.devDependencies["size-plugin"]
    ) {
      exists = true;
    }
    return exists;
  } catch (e) {
    log(e);
    return false;
  }
};
