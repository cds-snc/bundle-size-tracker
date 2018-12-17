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
    expect(results.after).toEqual("b066e22f9a11db5c75d63591dd0d412e9b267f9d");
  });
});
