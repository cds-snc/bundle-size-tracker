import { getFileIfExists } from "./getFile";
import dotenv from "dotenv";

const getData = async filePath => {
  const configData = await getFileIfExists(filePath);

  if (!configData) {
    return false;
  }

  return dotenv.parse(configData);
};

export const loadLocalConfig = async filePath => {
  const configData = await getData(filePath);
  if (configData) {
    const whiteList = ["BUILD_CMD", "SRC_PATH"];
    for (let k in configData) {
      if (whiteList.includes(k)) {
        process.env[k] = configData[k];
      }
    }
    return true;
  }
  return false;
};
