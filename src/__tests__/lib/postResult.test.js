import { postResult } from "../../lib/postResult";
import { webhook } from "../../__mocks__/webhook";
import { createStatus } from "../../__mocks__/create-status";

const octokit = {};
const mockCallback = jest.fn(() => createStatus);

octokit.authenticate = () => {
  return true;
};
octokit.repos = {};
octokit.repos.createStatus = mockCallback;

describe("handles postResult", () => {
  it("returns false when no data is passed", async () => {
    let results = await postResult("", octokit);
    expect(results).toEqual(false);
  });

  it("returns true when passing valid data", async () => {
    const { body } = await webhook;
    let results = await postResult(body, octokit);
    expect(results.data.hasOwnProperty("created_at")).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
