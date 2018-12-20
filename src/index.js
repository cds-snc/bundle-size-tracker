require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;

module.exports.trackSize = async (request, response) => {
  await hello(request);
  response.status(200).send("Done!");
};
