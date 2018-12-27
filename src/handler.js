"use strict";
import octokit, {
  notify,
  validate,
  build,
  loadFromFirestore,
  saveToFirestore,
  diff
} from "./lib/";

export const hello = async event => {
  try {
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

    await build({ name, fullName, after, previousMaster });

    const { fileSizeData, msg } = await diff({
      name,
      previousBranch,
      previousMaster
    });

    notify(body, octokit, {
      state: "success",
      description: msg
    });

    saveToFirestore({
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
