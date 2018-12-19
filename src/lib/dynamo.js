let AWS = require("aws-sdk");

AWS.config.update({
  region: "ca-central-1"
});

module.exports.loadFromDynamo = async (repo, sha) => {
  let docClient = new AWS.DynamoDB.DocumentClient({ dynamoDbCrc32: false });
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

  const p = new Promise((resolve, reject) => {
    docClient.query(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        let results = {};
        data.Items.forEach(i => (results[i.sha] = i));
        const masters = data.Items.filter(
          i => i.branch === "refs/heads/master"
        ).sort((a, b) => b.timestamp - a.timestamp);
        if (results.hasOwnProperty(sha)) {
          resolve([
            results[sha],
            masters.length > 0 ? masters[0] : { data: [{ files: [] }] }
          ]);
        } else {
          resolve([
            { data: [{ files: [] }] },
            masters.length > 0 ? masters[0] : { data: [{ files: [] }] }
          ]);
        }
      }
    });
  });
  let r = await p;
  return r;
};

module.exports.saveToDynamo = async payload => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  payload["timestamp"] = Date.now();
  let params = {
    TableName: "bundle_sizes",
    Item: payload
  };

  const p = new Promise((resolve, reject) => {
    docClient.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
  let r = await p;
  return r;
};
