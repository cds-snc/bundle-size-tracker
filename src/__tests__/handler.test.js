import { webhook } from "../__mocks__/webhook";
import { hello } from "../handler";
import { build } from "../lib/build";

jest.mock("../lib/build", () => ({
  build: jest.fn(({ name, fullName, after }, octokit, body) => {
    return true;
  })
}));

jest.mock("../lib/buildSizesPath", () => ({
  buildSizesPath: jest.fn(() => {
    const path = require("path");
    const filePath = path.resolve(
      global.process.cwd(),
      "src/__mocks__/build-sizes.json"
    );

    return filePath;
  })
}));

test("returns 200 status code", async () => {
  const result = await hello(await webhook);
  const call = build.mock.calls[0][0];
  expect(build).toHaveBeenCalledTimes(1);
  expect(call.name).toEqual("bundle-size-tracker-demo-app");
  expect(call.previousMaster.sha).toEqual(
    "bcb9ef283900698971b4e1c44817943793ef22f7"
  );
  expect(result).toEqual("Master: +66.6 kB, Branch: +66.6 kB");
});
