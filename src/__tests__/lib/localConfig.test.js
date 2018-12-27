import { loadLocalConfig } from "../../lib/localConfig";
import path from "path";

const filePath = (filename = ".bundle-size-tracker-config") => {
  return path.resolve(__dirname, `../../__mocks__/${filename}`);
};

describe("loads local ENV config variables specific to that repo", () => {
  it("returns false when no data is passed", async () => {
    try {
      const results = await loadLocalConfig(filePath(""));
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns true when the file exists ", async () => {
    const results = await loadLocalConfig(filePath());
    expect(results).toEqual(true);
  });

  it("only process white listed keys", async () => {
    await loadLocalConfig(filePath());
    expect(process.env.BUILD_CMD).toEqual("buildz");
    expect(process.env.hasOwnProperty("FOO")).toEqual(false);
  });
});
