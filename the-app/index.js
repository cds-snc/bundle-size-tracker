// index.js
let over9000 = require('over-9k')
over9000(9001) // true

require("@babel/register")({});
require = require("esm")(module);
module.exports = require("./src/server");
