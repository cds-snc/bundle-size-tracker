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
    let results = validate(webhook);
    expect(results.after).toEqual("45b649c612d0015284cee1c485611ce0e4943fcd");
  });
});
