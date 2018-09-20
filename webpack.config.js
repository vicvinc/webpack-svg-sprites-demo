const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const { VueLoaderPlugin } = require("vue-loader");

const srcPath = file => path.join(__dirname, "./src", file);
const viewsPath = views => path.join(__dirname, "./public", views);
const assetsPath = file => path.join(__dirname, "./assets", file);

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";
const isDev = NODE_ENV === "development";

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
  new SpriteLoaderPlugin(),
  new VueLoaderPlugin(),
  // dev hot replacement
  new webpack.HotModuleReplacementPlugin(),
  new MiniCssExtractPlugin({
    filename: isProd ? "css/[name].[hash:8].css" : "css/[name].css",
    chunkFilename: isProd ? "css/chunk.[name].[hash:8].css" : "css/[id].css"
  }),
  new HtmlWebpackPlugin({
    inject: true,
    minify: isProd ? { html5: false } : {},
    BASE_URL: STATIC_HOST,
    chunks: ["vendors", "commons", "app"],
    favicon: assetsPath("/images/logo/logo.png"),
    filename: "index.html",
    template: viewsPath("index.ejs")
  })
];
module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    app: srcPath("index.js"),
    vendor: ["vue", "vuex", "vue-router", "whatwg-fetch"]
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "js/[name].[hash:8].js",
    chunkFilename: "js/chunks/[name].[hash:8].js",
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
        loader: "babel-loader"
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
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "images/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              esModule: false,
              extract: true,
              publicPath: "images/"
            }
          },
          "svg-fill-loader",
          "svgo-loader"
        ]
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
  devtool: isDev ? "cheap-source-map" : false
};
