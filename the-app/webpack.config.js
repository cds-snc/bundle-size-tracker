const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const SizePlugin = require("size-plugin");
const SizePlugin = require("cds-size-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const title = "hello";

module.exports = ({ mode = "production" }) => {
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
          ignore: [
            "style.css",
            "components/*",
            "client.js",
            "server.js",
            "template/*"
          ]
        }
      ]),
      new HtmlWebpackPlugin({
        title,
        template: "src/template/index.html"
      }),
      new SizePlugin({
        save: fileSizes => {
          console.log(fileSizes);
        }
      })
    ],
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 250000, // in bytes, default 250k
      maxAssetSize: 450000 // in bytes
    },
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
