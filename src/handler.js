"use strict";
import octokit, {
  notify,
  validate,
  build,
  delta,
  loadFromDynamo,
  saveToDynamo,
  readFileSizeData
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

    const sum = await delta({ previousData, before });

    // Step 8. Post back to PR in Github
    console.log(sum);

    const fileSizeData = await readFileSizeData(name);

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

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

(async () => {
  hello(await webhook);
})();
