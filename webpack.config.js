const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const srcPath = file => path.join(__dirname, "./src", file);
const viewsPath = views => path.join(__dirname, "./public", views);
const assetsPath = file => path.join(__dirname, "./assets", file);

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";
const isDebug = process.env.DEBUG === true;

console.log("current run env is:", NODE_ENV); // eslint-disable-line no-console

// const STATIC_HOST = isProd ? '//kuaikanapi.com/' : '/'
const STATIC_HOST = "/";

const optimization = {
  splitChunks: {
    chunks: "all",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: "-",
    name: true,
    cacheGroups: {
      vendors: {
        name: "vendors",
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      commons: {
        name: "commons",
        chunks: "initial",
        minChunks: 2
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
};

const plugins = [
  new VueLoaderPlugin(),
  // dev hot replacement
  new webpack.HotModuleReplacementPlugin(),
  // 样式表
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: isProd ? "css/[name].[hash:8].css" : "css/[name].css",
    chunkFilename: isProd ? "css/chunk.[name].[hash:8].css" : "css/[id].css"
  }),
  // 首页
  new HtmlWebpackPlugin({
    inject: true,
    minify: isProd
      ? {
          html5: false
        }
      : {},
    BASE_URL: STATIC_HOST,
    chunks: ["vendors", "commons", "app"],
    favicon: assetsPath("/images/logo/logo.png"),
    filename: "index.html",
    template: viewsPath("index.ejs"),
    isProd: isProd
  })
];
/*
isProd && plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8299,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info'
}))
*/
module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    app: srcPath("index.js"),
    vendor: ["vue", "vuex", "vue-router", "whatwg-fetch"]
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "js/[name].[hash:8].js",
    chunkFilename: "js/chunk.[name].[hash:8].js",
    publicPath: STATIC_HOST,
    libraryTarget: "var"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: "127.0.0.1",
    port: 8088,
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
      "@": srcPath("/")
    }
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
  plugins,
  devtool: isDebug ? "cheap-source-map" : false
};
