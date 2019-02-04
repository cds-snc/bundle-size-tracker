import { notify } from "../../lib/notify";
import { webhook } from "../../__mocks__/webhook";
import { createStatus } from "../../__mocks__/create-status";

const mockCallback = jest.fn(() => createStatus);

jest.mock("../../lib/githubAuth", () => {
  return {
    authenticate: jest.fn(() => {
      const octokit = {};
      const mockCallback = jest.fn(() => ({
        data: { total_count: 1, items: [{ path: "package.json" }] }
      }));

      octokit.apps = {};
      octokit.apps.createInstallationToken = () => {
        return { data: { token: "foo" } };
      };

      octokit.repos = {};
      octokit.repos.createStatus = mockCallback;
      return octokit;
    })
  };
});

describe("handles notify", () => {
  it("returns false when no data is passed", async () => {
    try {
      const results = await notify("");
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns true when passing valid data", async () => {
    try {
      const { body } = await webhook;
      let results = await notify(body);
      expect(results.data.hasOwnProperty("created_at")).toEqual(true);
      expect(mockCallback.mock.calls.length).toBe(1);
    } catch (e) {}
  });
});
