require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;

module.exports.handleEvent = async (event, context) => {
  await hello(event, context);
};
