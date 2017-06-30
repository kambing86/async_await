const webpack = require("webpack");
const path = require("path");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

const sourcePath = path.join(__dirname, "src");
const deployPath = path.join(__dirname, "dist");
const serverPort = 8080;
const environment = process.env.NODE_ENV;

const config = {
  target: "node",
  devtool: "source-map",
  entry: {
    index: [
      "./index.js",
    ],
  },
  context: sourcePath,
  output: {
    path: deployPath,
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  resolve: {
    modules: [
      "node_modules",
    ],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: sourcePath,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
        },
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: environment === "development",
      "process.env": {
        NODE_ENV: JSON.stringify(environment),
      },
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false,
    //   },
    //   mangle: {
    //     props: {
    //       regex: /^rn_.+_rn$/,
    //     },
    //   },
    //   output: {
    //     comments: false,
    //   },
    // }),
    new webpack.NormalModuleReplacementPlugin(
      /\.\/rx.lite/,
      "rx-lite"
    ),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.ProvidePlugin({
    //   "Promise": "bluebird"
    // }),
    // new ExtractTextPlugin({
    //   filename: "[name].css",
    //   allChunks: true,
    // }),
  ],
  devServer: {
    contentBase: deployPath,
    compress: true,
    port: serverPort,
    // enable HMR globally
    // needed if webpack-dev-server run without --hot
    // hot: true,
  },
};

if (environment === "development") {
  config.devtool = "cheap-module-eval-source-map";

  // enable HMR globally
  // needed if webpack-dev-server run without --hot
  // config.entry["index"].unshift(`webpack-dev-server/client?http://localhost:${serverPort}/`, "webpack/hot/only-dev-server");
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());

  // prints more readable module names in the browser console on HMR updates
  config.plugins.push(new webpack.NamedModulesPlugin());
}

module.exports = config;
