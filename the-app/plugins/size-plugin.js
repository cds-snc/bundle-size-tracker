/* eslint-disable */

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var path = _interopDefault(require("path"));
var promisify = _interopDefault(require("util.promisify"));
var globPromise = _interopDefault(require("glob"));
var minimatch = _interopDefault(require("minimatch"));
var gzipSize = _interopDefault(require("gzip-size"));
var chalk = _interopDefault(require("chalk"));
var prettyBytes = _interopDefault(require("pretty-bytes"));
var escapeRegExp = _interopDefault(require("escape-string-regexp"));

function toMap(names, values) {
  return names.reduce(function(map, name, i) {
    map[name] = values[i];
    return map;
  }, {});
}

function dedupe(item, index, arr) {
  return arr.indexOf(item) === index;
}

var glob = promisify(globPromise);
var NAME = "SizePlugin";
var SizePlugin = function SizePlugin(options) {
  this.options = options || {};
  this.pattern = this.options.pattern || "**/*.{mjs,js,css,html}";
  this.exclude = this.options.exclude;
  this.save = this.options.save || function() {};
};
SizePlugin.prototype.reverseTemplate = function reverseTemplate(
  filename,
  template
) {
  if (typeof template === "function") {
    template = template({
      chunk: {
        name: "main"
      }
    });
  }
  var hashLength = this.output.hashDigestLength;
  var replace = [];
  var count = 0;
  function replacer() {
    var arguments$1 = arguments;

    var out = "";
    for (var i = 1; i < arguments.length - 2; i++) {
      var value = arguments$1[i];
      if (replace[i - 1]) {
        value = value.replace(/./g, "*");
      }
      out += value;
    }
    return out;
  }

  var reg = template.replace(/(^|.+?)(?:\[([a-z]+)(?::(\d))?\]|$)/g, function(
    s,
    before,
    type,
    size
  ) {
    var out = "";
    if (before) {
      out += "(" + escapeRegExp(before) + ")";
      replace[count++] = false;
    }
    if (type === "hash" || type === "contenthash" || type === "chunkhash") {
      var len = Math.round(size) || hashLength;
      out += "([0-9a-zA-Z]{" + len + "})";
      replace[count++] = true;
    } else if (type) {
      out += "(.*?)";
      replace[count++] = false;
    }
    return out;
  });
  var matcher = new RegExp("^" + reg + "$");
  return matcher.test(filename) && filename.replace(matcher, replacer);
};
SizePlugin.prototype.stripHash = function stripHash(filename) {
  return (
    this.reverseTemplate(filename, this.output.filename) ||
    this.reverseTemplate(filename, this.output.chunkFilename) ||
    filename
  );
};
SizePlugin.prototype.apply = function apply(compiler) {
  return new Promise(
    function($return, $error) {
      var this$1 = this;

      var outputPath = compiler.options.output.path;
      this.output = compiler.options.output;
      this.sizes = this.getSizes(outputPath);
      if (compiler.hooks && compiler.hooks.afterEmit) {
        return $return(
          compiler.hooks.afterEmit.tapPromise(NAME, function(compilation) {
            return this$1.outputSizes(compilation.assets).catch(console.error);
          })
        );
      }
      return $return(
        compiler.plugin("after-emit", function(compilation, callback) {
          this$1
            .outputSizes(compilation.assets)
            .catch(console.error)
            .then(callback);
        })
      );
    }.bind(this)
  );
};
SizePlugin.prototype.outputSizes = function outputSizes(assets) {
  return new Promise(
    function($return, $error) {
      var sizesBefore,
        isMatched,
        isExcluded,
        assetNames,
        sizes,
        files,
        width,
        output,
        fileSizes;
      return Promise.resolve(this.sizes).then(
        function($await_1) {
          try {
            sizesBefore = $await_1;
            isMatched = minimatch.filter(this.pattern);
            isExcluded = this.exclude
              ? minimatch.filter(this.exclude)
              : function() {
                  return false;
                };
            assetNames = Object.keys(assets).filter(function(file) {
              return isMatched(file) && !isExcluded(file);
            });
            return Promise.all(
              assetNames.map(function(name) {
                return gzipSize(assets[name].source());
              })
            ).then(
              function($await_2) {
                var this$1 = this;

                try {
                  sizes = $await_2;
                  this.sizes = toMap(
                    assetNames.map(function(filename) {
                      return this$1.stripHash(filename);
                    }),
                    sizes
                  );
                  files = Object.keys(this.sizes).filter(dedupe);
                  width = Math.max.apply(
                    Math,
                    files.map(function(file) {
                      return file.length;
                    })
                  );
                  output = "";
                  fileSizes = [];
                  for (var i = 0, list = files; i < list.length; i += 1) {
                    var name = list[i];

                    var size = void 0;
                    size = this$1.sizes[name] || 0;
                    var delta = void 0;
                    delta = size - (sizesBefore[name] || 0);
                    var msg = void 0;
                    msg =
                      new Array(width - name.length + 2).join(" ") +
                      name +
                      " ⏤  ";
                    var color = void 0;
                    color =
                      size > 100 * 1024
                        ? "red"
                        : size > 40 * 1024
                        ? "yellow"
                        : size > 20 * 1024
                        ? "cyan"
                        : "green";
                    var sizeText = chalk[color](prettyBytes(size));
                    if (delta) {
                      var deltaText =
                        (delta > 0 ? "+" : "") + prettyBytes(delta);
                      if (delta > 1024) {
                        sizeText = chalk.bold(sizeText);
                        deltaText = chalk.red(deltaText);
                      } else if (delta < -10) {
                        deltaText = chalk.green(deltaText);
                      }
                      sizeText += " (" + deltaText + ")";
                    }
                    output += msg + sizeText + "\n";
                    fileSizes.push({
                      filename: name,
                      filesize: size
                    });
                  }
                  if (output) {
                    this.save(fileSizes);
                    console.log(output);
                  }
                  return $return();
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this),
              $error
            );
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this),
        $error
      );
    }.bind(this)
  );
};
SizePlugin.prototype.getSizes = function getSizes(cwd) {
  return new Promise(
    function($return, $error) {
      var files, sizes;
      return glob(this.pattern, {
        cwd: cwd,
        ignore: this.exclude
      }).then(
        function($await_3) {
          try {
            files = $await_3;
            return Promise.all(
              files.map(function(file) {
                return gzipSize.file(path.join(cwd, file)).catch(function() {
                  return null;
                });
              })
            ).then(
              function($await_4) {
                var this$1 = this;

                try {
                  sizes = $await_4;
                  return $return(
                    toMap(
                      files.map(function(filename) {
                        return this$1.stripHash(filename);
                      }),
                      sizes
                    )
                  );
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this),
              $error
            );
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this),
        $error
      );
    }.bind(this)
  );
};

module.exports = SizePlugin;
// # sourceMappingURL=size-plugin.js.map
