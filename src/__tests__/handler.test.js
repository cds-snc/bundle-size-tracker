import { webhook } from "../__mocks__/webhook";
import { hello } from "../handler";

test("returns 200 status code", async () => {
  const result = await hello(await webhook);
  expect(result).toEqual("Master: +66.6 kB, Branch: +66.6 kB");
});
