"use strict";
import { validate } from "./lib/validate";
import { notify } from "./lib/notify";
import { loadFromDynamo, saveToDynamo } from "./lib/dynamo";
import { checkout } from "./lib/checkout";
import { hasPlugin } from "./lib/hasPlugin";
import { calculateDelta, sumDelta } from "./lib/delta";
const octokit = require("@octokit/rest")();

export const hello = async (event, context) => {
  const body = validate(event);

  if (!body) {
    return false;
  }

  if (!notify(body, octokit)) {
    return false;
  }

  const name = event.repository.name;
  const fullName = event.repository.fullName;
  const before = event.before;
  const after = event.after;

  const previousData = await loadFromDynamo(fullName);

  const storePath = process.env.STORE_PATH || "/tmp";
  if (!checkout(storePath, name, after)) {
    // @todo actually check out the sha
    console.log(`${name} failed to checkout`);
    return false;
  }

  // Use if your package.json is in a different location that root ex: /the-app
  const buildPath = process.env.buildPath || "";

  const filePath = `${storePath}${buildPath}/${name}/package.json`;
  if (filePath && !hasPlugin(filePath)) {
    console.log("plugin not found");
    return false;
  }

  // Step 6: Run npm build

  let result;
  // Step 7: Calculate delta
  if (previousData.hasOwnProperty(before)) {
    result = calculateDelta(previousData[before], {}); // @todo second param needs to be result of npm build
  } else {
    // @todo look up latest master ref
    result = calculateDelta({}, {}); // @todo second param needs to be result of npm build
  }

  // Step 8. Post back to PR in Github
  console.log(sumDelta(result));

  // Step 9: Save new result set to DynamoDB
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
};
