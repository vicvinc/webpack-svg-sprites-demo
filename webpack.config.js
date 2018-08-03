const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
var ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const srcPath = file => path.join(__dirname, "./src", file);
const pagePath = file => path.join(__dirname, "./src/js/pages", file);

const isProd = process.env.API_ENV === "production";
const isPrepro = process.env.API_ENV === "prepro";
const isDev = process.env.API_ENV === "development";

console.info(
  "\n",
  "api env: ",
  process.env.API_ENV || "",
  "\n",
  "node env: ",
  process.env.NODE_ENV || "",
  "\n",
  "dev user:",
  process.env.DEV_USER || ""
);

const STATIC_HOST = isProd
  ? "//img.gift.one/gift/"
  : isPrepro
    ? "//img.prepro.gift.one/gift/"
    : isDev
      ? "//img.giftdev.top/gift/"
      : "/gift/";

const entry = {
  "pc/home": pagePath("/pc/home.js"),
  "pc/wallet": pagePath("/pc/wallet.js"),
  "pc/profile": pagePath("/pc/profile.js"),
  "pc/login": pagePath("/pc/login.js"),
  "pc/register": pagePath("/pc/register.js"),
  "pc/forget-password": pagePath("/pc/forget-password.js"),
  "pc/find-back": pagePath("/pc/find-back.js"),
  "pc/bind-email": pagePath("/pc/bind-email.js"),
  "pc/about-us": pagePath("/pc/about-us.js"),
  "pc/airdrop": pagePath("/pc/airdrop.js"),
  // mpa-h5 pages
  "h5/profile": pagePath("/h5/profile.js"),
  "h5/home": pagePath("/h5/home.js"),
  "h5/airdrop": pagePath("/h5/airdrop.js")
};

const optimization = {
  splitChunks: {
    chunks: "all",
    minSize: 30000,
    minChunks: 2,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: "-",
    cacheGroups: {
      common: {
        name: "common",
        chunks: "initial",
        minChunks: 4,
        test: /i18n|component/
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  }
};

const plugins = [
  new VueLoaderPlugin(),
  new ManifestPlugin({
    fileName: "mix-manifest.json"
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    API_ENV: JSON.stringify(process.env.API_ENV),
    DEV_USER: JSON.stringify(process.env.DEV_USER)
  }),
  // dev hot replacement
  new webpack.HotModuleReplacementPlugin(),
  // 样式表
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: isProd ? "css/[name].[hash:8].css" : "css/[name].css",
    chunkFilename: isProd ? "css/chunk.[name].[hash:8].css" : "css/[id].css"
  })
];

plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "server",
    analyzerHost: "127.0.0.1",
    analyzerPort: 3004,
    reportFilename: "report.html",
    defaultSizes: "parsed",
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: "stats.json",
    statsOptions: null,
    logLevel: "info"
  })
);

module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    ...entry,
    vendor: [
      "vue",
      "vuex",
      "vue-i18n",
      "vue-router",
      "whatwg-fetch",
      "async-validator",
      "@/i18n/common",
      "@/component/swipe",
      "@/component/popup",
      "@/component/toast",
      "@/component/loading",
      "@/component/swipe/item",
      "@/component/vendor-loading",
      "@/component/intl-tel-input",
      "@/component/no-captcha"
    ]
  },
  output: {
    path: path.join(__dirname, "./public/gift/"),
    filename: "js/[name].[hash:8].js",
    chunkFilename: "js/chunks/[name].[hash:8].js",
    publicPath: STATIC_HOST,
    libraryTarget: "var"
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    host: "127.0.0.1",
    port: 3005,
    hot: true,
    watchContentBase: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    }
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    modules: [srcPath("/"), "node_modules"],
    alias: {
      vue: "vue/dist/vue.js",
      $: srcPath("/js/external/jquery.min.js"),
      jquery: srcPath("/js/external/jquery.min.js"),
      "@": srcPath("/js"),
      "@less": srcPath("/less"),
      "@img": srcPath("/images"),
      "@json": srcPath("/json")
    }
  },
  externals: {
    jquery: "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "images/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "[name].[hash:8].[ext]",
          outputPath: "fonts/"
        }
      }
    ]
  },
  optimization,
  plugins
};
