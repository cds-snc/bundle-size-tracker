'use strict';

module.exports.hello = async (event, context) => {
  
  // Step 1: Validate event data
  // Step 2: Notify PR in Github that check is running
  // Step 3: At the same time query DynamoDB if previous data exists
  // Step 4: Check out code from Github
  // Step 5: Validate webpack has the required plugins
  // Step 6: Run npm build
  // Step 7: Calculate delta and post back to PR in Github
  // Step 8: Save new result set to DynamoDB
  
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
