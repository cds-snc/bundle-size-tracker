import { notify } from "../../lib/notify";
import { webhook } from "../../__mocks__/webhook";

const octokit = {};
octokit.authenticate = () => {
  return true;
};
octokit.repos = {};
octokit.repos.createStatus = () => {
  return true;
};

describe("handles notify", () => {
  it("returns false when no data is passed", async () => {
    let results = await notify("", octokit);
    expect(results).toEqual(false);
  });

  it("returns true when passing valid data", async () => {
    const body = JSON.parse(webhook.body);
    let results = await notify(body, octokit);
    expect(results).toEqual(true);
  });
});
