// import request from "supertest";
import { loadFromDynamo, saveFromDynamo } from "../../lib/dynamo";

let nock = require("nock");

describe("loadFromDynamo", () => {
  it("returns a map of data related to a repo", async () => {
    let db = nock("https://dynamodb.ca-central-1.amazonaws.com/")
      .post("/")
      .reply(200, { Items: {} });
    let result = await loadFromDynamo("cds-snc/sample");
  });
});
