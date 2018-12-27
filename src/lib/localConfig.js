import { getFileIfExists } from "./getFile";
import dotenv from "dotenv";

const whiteList = ["BUILD_CMD", "SRC_PATH"];

const getEnvData = async filePath => {
  const configData = await getFileIfExists(filePath);

  if (!configData) return false;

  return dotenv.parse(configData);
};

export const loadLocalConfig = async filePath => {
  const configData = await getEnvData(filePath);

  if (!configData) return false;

  Object.keys(configData).forEach(k => {
    if (whiteList.includes(k)) {
      process.env[k] = configData[k];
    }
  });

  return true;
};
