require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;
const localPayload = require("./handler").localPayload;

const trackSize = async (request, response) => {
  await hello(request);
  response.status(200).send("Done!");
};

// used for local testing

(async () => {
  await localPayload();
})();

module.exports.trackSize = trackSize;
