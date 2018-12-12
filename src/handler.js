"use strict";
import { validate } from "./lib/validate";
import { notify } from "./lib/notify";

require("dotenv-safe").config({ allowEmptyValues: true });
const octokit = require("@octokit/rest")();

export const hello = async (event, context) => {
  const body = validate(event);

  if (!body) {
    return false;
  }

  if (!notify(body, octokit)) {
    return false;
  }

  // Step 2: Notify PR in Github that check is running
  // Step 3: At the same time query DynamoDB if previous data exists
  // Step 4: Check out code from Github
  // Step 5: Validate webpack has the required plugins
  // Step 6: Run npm build
  // Step 7: Calculate delta 
  // Step 8. Post back to PR in Github
  // Step 9: Save new result set to DynamoDB

  // Potential Data structure
  // {repo: "", sha: "", branch: "", timestamp: "", data: {}}

  console.log("This is the event:", event);
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
