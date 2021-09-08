const path = require("path");

module.exports = {
  mode: "production",
  devtool: false,
  entry: "./src/gtm_storage.js",
  output: {
    publicPath: "public",
    filename: "gtm_storage.js",
    path: path.resolve(__dirname, "public"),
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /gtm_storage\.js$/,
        include: [path.resolve(__dirname, "public")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [],
};
