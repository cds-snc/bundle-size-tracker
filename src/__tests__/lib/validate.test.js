import { validate } from "../../lib/validate";
import { webhook } from "../../__mocks__/webhook";

describe("validates incoming event data", () => {
  it("returns false when no data is passed", async () => {
    let results = validate();
    expect(results).toEqual(false);
  });

  it("returns false when missing body", async () => {
    let results = validate({ headers: "" });
    expect(results).toEqual(false);
  });

  it("returns false when missing header information", async () => {
    let results = validate({ headers: "", body: "" });
    expect(results).toEqual(false);
  });

  it("returns true when passing a valid event", async () => {
    let results = validate(await webhook);
    expect(results.after).toEqual("514660a2e1e6179ac7051f1b767bfbdec8832fea");
  });
});
