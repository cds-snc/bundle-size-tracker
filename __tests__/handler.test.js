const hello = require("../src/handler").hello;

test("returns 200 status code", async () => {
  const result = await hello();
  expect(result.statusCode).toEqual(200);
});
