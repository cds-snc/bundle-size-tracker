const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SizePlugin = require("size-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const title = "App Context";

module.exports = ({ mode }) => {
  console.log("mode", mode);
  return {
    entry: "./src/client.js",
    mode: mode,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js"
    },
    plugins: [
      new CleanWebpackPlugin("dist"),
      new MiniCssExtractPlugin({
        filename: "style.min.css"
      }),
      new CopyWebpackPlugin([
        {
          from: "src",
          to: "./",
          ignore: ["style.css", "components/*", "client.js", "server.js"]
        }
      ]),
      mode === "development"
        ? new HtmlWebpackPlugin({
            title,
            template: "src/template/index.html"
          })
        : () => {
            return null;
          },
      new SizePlugin()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css/,
          use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"]
        }
      ]
    }
  };
};
