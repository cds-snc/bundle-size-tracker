import { notify } from "../../lib/notify";
import { webhook } from "../../__mocks__/webhook";
import { createStatus } from "../../__mocks__/create-status";

const octokit = {};
const mockCallback = jest.fn(() => createStatus);

octokit.authenticate = () => {
  return true;
};
octokit.repos = {};
octokit.repos.createStatus = mockCallback;

describe("handles notify", () => {
  it("returns false when no data is passed", async () => {
    try {
      const results = await notify("", octokit);
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns true when passing valid data", async () => {
    try {
      const { body } = await webhook;
      let results = await notify(body, octokit);
      expect(results.data.hasOwnProperty("created_at")).toEqual(true);
      expect(mockCallback.mock.calls.length).toBe(1);
    } catch (e) {}
  });
});
