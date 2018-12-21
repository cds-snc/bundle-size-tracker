"use strict";
import octokit, {
  notify,
  validate,
  build,
  delta,
  loadFromDynamo,
  saveToDynamo,
  readFileSizeData,
  postResult
} from "./lib/";

// import { webhook } from "./__mocks__/webhook";

import prettyBytes from "pretty-bytes";

export const hello = async event => {
  /*
  if (!event) {
    event = webhook;
  }
  */

  try {
    const body = validate(event);

    if (!(await notify(body, octokit))) {
      throw new Error("failed to notify");
    }

    const {
      after,
      before,
      repository: { name, full_name: fullName }
    } = body;

    const [previousBranch, previousMaster] = await loadFromDynamo(
      fullName,
      before
    );

    await build({ name, fullName, after });
    const fileSizeData = await readFileSizeData(name);
    const branchSum = await delta(previousBranch, fileSizeData);
    const masterSum = await delta(previousMaster, fileSizeData);
    const msg = `Master: ${prettyBytes(masterSum, {
      signed: true
    })}, Branch: ${prettyBytes(branchSum, { signed: true })}`;
    postResult(body, octokit, msg);

    saveToDynamo({
      repo: fullName,
      sha: after,
      data: fileSizeData,
      branch: body.ref
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
