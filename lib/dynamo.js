let AWS = require("aws-sdk");

AWS.config.update({
  region: "ca-central-1"
});

module.exports.loadFromDynamo = async repo => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: "bundle_sizes",
    KeyConditionExpression: "#repo = :name",
    ExpressionAttributeNames: {
      "#repo": "repo"
    },
    ExpressionAttributeValues: {
      ":name": repo
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log(data);
      let results = {};
      data.Items.forEach(i => (results[i.sha] = i));
      return results;
    }
  });
};

module.exports.saveToDynamo = async payload => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  payload["timestamp"] = Date.now();
  let params = {
    TableName: "bundle_sizes",
    Item: payload
  };
  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      return true;
    }
  });
};
