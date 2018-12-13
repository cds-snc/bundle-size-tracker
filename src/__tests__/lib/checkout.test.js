import { checkoutRepo } from "../../lib/checkout";

describe("checkoutRepo", () => {
  it("returns false if the repo does not exist", async () => {
    expect(await checkoutRepo("/tmp", "foo", "abcd")).toEqual(false);
  });
});
