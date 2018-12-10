// index.js
require("@babel/register")({});
require = require("esm")(module);
module.exports = require("./src/server");
