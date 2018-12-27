"use strict";
import octokit, {
  notify,
  validate,
  build,
  loadFromFirestore,
  saveToFirestore,
  diff
} from "./lib/";

import { webhook } from "./__mocks__/webhook";

export const localPayload = async () => {
  const event = await webhook;
  hello(event);
};

const init = event => {
  const body = validate(event);

  notify(body, octokit, {
    state: "pending",
    description: "Checking bundle size"
  });

  return body;
};

const reportDiff = async ({
  fullName,
  name,
  after,
  previousBranch,
  previousMaster,
  body
}) => {
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

  return msg;
};

export const hello = async event => {
  try {
    const body = init(event);

    const {
      after,
      before,
      repository: { name, full_name: fullName }
    } = body;

    const [previousBranch, previousMaster] = await loadFromFirestore(
      fullName,
      before
    );

    await build({ name, fullName, after, previousMaster }, octokit, body);

    const msg = await reportDiff({
      fullName,
      name,
      after,
      previousBranch,
      previousMaster,
      body
    });
    return msg;
  } catch (e) {
    console.log(e.message);
    const body = validate(event);
    await notify(body, octokit, { state: "error", description: e.message });
    return false;
  }
};
