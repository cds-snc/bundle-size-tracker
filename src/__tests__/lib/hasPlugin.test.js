import { hasPlugin } from "../../lib/hasPlugin";
import path from "path";

const filePath = (filename = "package-json-mock.json") => {
  return path.resolve(__dirname, `../../__mocks__/${filename}`);
};

describe("detects size plugin in package.json", () => {
  it("returns false when no data is passed", async () => {
    try {
      const results = await hasPlugin(filePath(""));
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns true when the plugin exists", async () => {
    const results = await hasPlugin(filePath("package-json-mock.json"));
    expect(results).toEqual(true);
  });

  it("returns false when plugin isn't found", async () => {
    const results = await hasPlugin(
      filePath("package-json-mock-no-plugin.json")
    );
    expect(results).toEqual(false);
  });
});
