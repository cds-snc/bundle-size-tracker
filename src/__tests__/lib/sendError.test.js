import { sendError } from "../../lib/sendError";
import { webhook } from "../../__mocks__/webhook";
import { createStatus } from "../../__mocks__/create-status";

const octokit = {};
const mockCallback = jest.fn(() => createStatus);

octokit.authenticate = () => {
  return true;
};
octokit.repos = {};
octokit.repos.createStatus = mockCallback;

describe("handles sendError", () => {
  it("returns false when no data is passed", async () => {
    let results = await sendError("", octokit);
    expect(results).toEqual(false);
  });

  it("returns true when passing valid data", async () => {
    const { body } = await webhook;
    let results = await sendError(body, octokit);
    expect(results.data.hasOwnProperty("created_at")).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
