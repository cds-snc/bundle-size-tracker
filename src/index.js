require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;

const handleEvent = async event => {
  hello(event);
};

module.exports = handleEvent;
