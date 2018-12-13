import { loadFromDynamo, saveToDynamo } from "../../lib/dynamo";

let nock = require("nock");

describe("loadFromDynamo", () => {
  it("returns data for a specific sha", async () => {
    nock("https://dynamodb.ca-central-1.amazonaws.com:443", {
      encodedQueryParams: true
    })
      .post("/", {
        TableName: "bundle_sizes",
        KeyConditionExpression: "#repo = :name",
        ExpressionAttributeNames: { "#repo": "repo" },
        ExpressionAttributeValues: { ":name": { S: "cds-snc/sample" } }
      })
      .reply(
        200,
        {
          Count: 2,
          Items: [
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "abcd" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "master" },
              timestamp: { N: "1544562296580" }
            },
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "efgh" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "test" },
              timestamp: { N: "1544562468330" }
            }
          ],
          ScannedCount: 2
        },
        [
          "Server",
          "Server",
          "Date",
          "Tue, 11 Dec 2018 21:33:06 GMT",
          "Content-Type",
          "application/x-amz-json-1.0",
          "Content-Length",
          "322",
          "Connection",
          "keep-alive",
          "x-amzn-RequestId",
          "GH87381EAA9Q410G95OAHDFDVVVV4KQNSO5AEMVJF66Q9ASUAAJG",
          "x-amz-crc32",
          "725941549"
        ]
      );
    let result = await loadFromDynamo("cds-snc/sample", "efgh");
    expect(result.branch).toEqual("test");
  });

  it("returns the last master data if no sha is found", async () => {
    nock("https://dynamodb.ca-central-1.amazonaws.com:443", {
      encodedQueryParams: true
    })
      .post("/", {
        TableName: "bundle_sizes",
        KeyConditionExpression: "#repo = :name",
        ExpressionAttributeNames: { "#repo": "repo" },
        ExpressionAttributeValues: { ":name": { S: "cds-snc/sample" } }
      })
      .reply(
        200,
        {
          Count: 2,
          Items: [
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "abcd" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "master" },
              timestamp: { N: "1544562296580" }
            },
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "efgh" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "master" },
              timestamp: { N: "1544562468330" }
            }
          ],
          ScannedCount: 2
        },
        [
          "Server",
          "Server",
          "Date",
          "Tue, 11 Dec 2018 21:33:06 GMT",
          "Content-Type",
          "application/x-amz-json-1.0",
          "Content-Length",
          "322",
          "Connection",
          "keep-alive",
          "x-amzn-RequestId",
          "GH87381EAA9Q410G95OAHDFDVVVV4KQNSO5AEMVJF66Q9ASUAAJG",
          "x-amz-crc32",
          "725941549"
        ]
      );
    let result = await loadFromDynamo("cds-snc/sample", "ijkl");
    expect(result.branch).toEqual("master");
    expect(result.sha).toEqual("efgh");
  });

  it("returnsan empty object with no data if nothing exists", async () => {
    nock("https://dynamodb.ca-central-1.amazonaws.com:443", {
      encodedQueryParams: true
    })
      .post("/", {
        TableName: "bundle_sizes",
        KeyConditionExpression: "#repo = :name",
        ExpressionAttributeNames: { "#repo": "repo" },
        ExpressionAttributeValues: { ":name": { S: "cds-snc/sample" } }
      })
      .reply(
        200,
        {
          Count: 2,
          Items: [
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "abcd" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "test" },
              timestamp: { N: "1544562296580" }
            },
            {
              repo: { S: "cds-snc/sample" },
              sha: { S: "efgh" },
              data: { M: { foo: { S: "bar" } } },
              branch: { S: "test" },
              timestamp: { N: "1544562468330" }
            }
          ],
          ScannedCount: 2
        },
        [
          "Server",
          "Server",
          "Date",
          "Tue, 11 Dec 2018 21:33:06 GMT",
          "Content-Type",
          "application/x-amz-json-1.0",
          "Content-Length",
          "322",
          "Connection",
          "keep-alive",
          "x-amzn-RequestId",
          "GH87381EAA9Q410G95OAHDFDVVVV4KQNSO5AEMVJF66Q9ASUAAJG",
          "x-amz-crc32",
          "725941549"
        ]
      );
    let result = await loadFromDynamo("cds-snc/sample", "ijkl");
    expect(result.data).toEqual({ files: [] });
  });
});

describe("saveToDynamo", () => {
  it("saves an object to DynamoDB", async () => {
    let payload = {
      repo: "cds-snc/sample",
      branch: "master",
      sha: "ijkl",
      data: { foo: "bar" }
    };
    nock("https://dynamodb.ca-central-1.amazonaws.com:443", {
      encodedQueryParams: true
    })
      .post("/")
      .reply(200, {}, [
        "Server",
        "Server",
        "Date",
        "Tue,11Dec201821:42:45GMT",
        "Content-Type",
        "application/x-amz-json-1.0",
        "Content-Length",
        "2",
        "Connection",
        "keep-alive",
        "x-amzn-RequestId",
        "A7CDS4DL7I6H1R22ADUDT93TQBVV4KQNSO5AEMVJF66Q9ASUAAJG",
        "x-amz-crc32",
        "2745614147"
      ]);
    let results = await saveToDynamo(payload);
    expect(results).toEqual(true);
  });
});
