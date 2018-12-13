import { checkout } from "./checkout";
import { hasPlugin } from "./hasPlugin";
export const build = ({ name, fullName, after }) => {
  // checkout the repo
  const tmpPath = process.env.TMP_PATH || "/tmp";
  if (!checkout(tmpPath, fullName, after)) {
    throw new Error(`${fullName} failed to checkout`);
  }

  // Use if your package.json is in a different location that root ex: /the-app
  const buildPath = process.env.buildPath || "";

  const filePath = `${tmpPath}${buildPath}/${name}/package.json`;
  if (filePath && !hasPlugin(filePath)) {
    throw new Error("plugin not found");
  }

  // do build
  return true;
};
