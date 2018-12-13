"use strict";
import {
  notify,
  validate,
  build,
  delta,
  loadFromDynamo,
  saveToDynamo,
  octo
} from "./lib/";

import { webhook } from "./__mocks__/webhook";

export const hello = async (event, context) => {
  try {
    const body = validate(event);

    if (!body) {
      throw new Error("event validation failed");
    }

    if (!notify(body, octo)) {
      throw new Error("failed to notify");
    }

    const fullName = body.repository.full_name;
    const name = body.repository.name;
    const { after, before } = body;
    const previousData = await loadFromDynamo(fullName, before);

    build({ name, fullName, after });

    const sum = await delta({ previousData, before });

    // Step 8. Post back to PR in Github
    console.log(sum);

    saveToDynamo({ repo: fullName, sha: after, data: {}, branch: body.ref }); // @todo second param needs to be result of npm build

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
