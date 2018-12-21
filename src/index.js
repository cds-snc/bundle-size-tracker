require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;

const trackSize = async (request, response) => {
  await hello(request);
  response.status(200).send("Done!");
};

/*
// used for local testing
(async () => {
  await hello();
})();
*/
module.exports.trackSize = trackSize;
