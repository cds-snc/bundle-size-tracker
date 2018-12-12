import fs from "fs";

const log = e => {
  if (process.env.NODE_ENV !== "test") {
    console.log(e.message);
  }
};

export const getFile = async file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error && error.code !== "ENOENT") reject(error);
      if (data) {
        resolve(JSON.parse(data));
      }
    });
  });
};

export const hasPlugin = async filePath => {
  try {
    const packageData = await getFile(filePath);

    if (
      packageData &&
      packageData.devDependencies &&
      packageData.devDependencies["size-plugin"]
    ) {
      return true;
    }
    return false;
  } catch (e) {
    log(e);
    return false;
  }
};
