import { checkout } from "../../lib/checkout";

describe("checkoutRepo", () => {
  it("returns false if the repo does not exist", async () => {
    expect(await checkout("/tmp", "foo", "abcd")).toEqual(false);
  });
});
