import fs from "fs";
export const getFile = async file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const getFileIfExists = async file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) resolve(false);
      resolve(data);
    });
  });
};
