const webpack = require("webpack");
const express = require("express");
const path = require("path");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");

const setup = app => {
  const router = express.Router();
  router.use(function(req, res, next) {
    next();
  });
  app.use("/", router);
};

const devConfig = {
  before: setup,
  contentBase: path.join(__dirname, "../dist"),
  compress: true,
  host: "0.0.0.0",
  hot: true,
  watchContentBase: true,
  historyApiFallback: true,
  disableHostCheck: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  }
};

const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, devConfig);

server.listen(8060);
