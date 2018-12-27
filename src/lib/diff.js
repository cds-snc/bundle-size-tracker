import { readFileSizeData, delta } from "./index";
import prettyBytes from "pretty-bytes";

export const diff = async ({ name, previousBranch, previousMaster }) => {
  const fileSizeData = await readFileSizeData(name);
  const branchSum = await delta(previousBranch, fileSizeData);
  const masterSum = await delta(previousMaster, fileSizeData);
  const msg = `Master: ${prettyBytes(masterSum, {
    signed: true
  })}, Branch: ${prettyBytes(branchSum, { signed: true })}`;

  return { fileSizeData, msg };
};
