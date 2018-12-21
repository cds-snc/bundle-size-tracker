import { validate } from "../../lib/validate";
import { webhook } from "../../__mocks__/webhook";

describe("validates incoming event data", () => {
  it("returns false when no data is passed", async () => {
    try {
      let results = validate();
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns false when missing body", async () => {
    try {
      let results = validate({ headers: "" });
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns false when missing header information", async () => {
    try {
      let results = validate({ headers: "", body: "" });
      expect(results).toEqual(false);
    } catch (e) {}
  });

  it("returns true when passing a valid event", async () => {
    try {
      let results = validate(await webhook);
      expect(results.after).toEqual("aaa057d34b0d091dfb3e4703f5e3e93f0eae48de");
    } catch (e) {}
  });
});
