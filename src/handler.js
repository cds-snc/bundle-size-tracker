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

import { webhook } from "./__mocks__/webhook";

export const hello = async (event, context) => {
  try {
    const body = validate(event);

    if (!body) {
      throw new Error("event validation failed");
    }

    if (!(await notify(body, octokit))) {
      throw new Error("failed to notify");
    }

    const {
      after,
      before,
      repository: { name, full_name: fullName }
    } = body;

    const previousData = await loadFromDynamo(fullName, before);

    await build({ name, fullName, after });
    const fileSizeData = await readFileSizeData(name);
    const sum = await delta(previousData, fileSizeData);

    postResult(body, octokit, sum);

    saveToDynamo({
      repo: fullName,
      sha: after,
      data: fileSizeData,
      branch: body.ref
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Go Serverless v1.1! Your function executed successfully!",
        input: event
      })
    };

  } catch (e) {
    console.log(e.message);
    return false;
  }
};

(async () => {
  hello(await webhook);
})();
