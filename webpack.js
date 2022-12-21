const path = require("path");
const CopyWebpack = require("copy-webpack-plugin");
module.exports = {
  target: "node",
  entry: "./index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/build",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new CopyWebpack({
      patterns: [{ from: "./prisma/schema.prisma", to: "./" }],
    }),
  ],
};
