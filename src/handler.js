"use strict";
import octokit, {
  notify,
  validate,
  build,
  delta,
  loadFromFirestore,
  saveToFirestore,
  readFileSizeData
} from "./lib/";

// import { webhook } from "./__mocks__/webhook";

import prettyBytes from "pretty-bytes";

export const hello = async event => {
  try {
    /*
    if (!event) {
      event = await webhook;
    }
    */

    const body = validate(event);

    if (!(await notify(body, octokit))) {
      throw new Error("Failed to notify");
    }

    const {
      after,
      before,
      repository: { name, full_name: fullName }
    } = body;

    const [previousBranch, previousMaster] = await loadFromFirestore(
      fullName,
      before
    );

    const md5str = await build({ name, fullName, after, previousMaster });
    const fileSizeData = await readFileSizeData(name);
    const branchSum = await delta(previousBranch, fileSizeData);
    const masterSum = await delta(previousMaster, fileSizeData);
    const msg = `Master: ${prettyBytes(masterSum, {
      signed: true
    })}, Branch: ${prettyBytes(branchSum, { signed: true })}`;

    notify(body, octokit, { state: "success", description: msg });

    saveToFirestore({
      repo: fullName,
      sha: after,
      data: fileSizeData,
      branch: body.ref,
      md5str
    });

    return true;
  } catch (e) {
    console.log(e.message);
    const body = validate(event);
    await notify(body, octokit, { state: "error", description: e.message });
    return false;
  }
};

/*
 */
