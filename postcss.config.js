module.exports = {
  parser: false, // "sugarss",
  plugins: {
    "postcss-preset-env": {},
    cssnano: {},
    autoprefixer: {
      browsers: "last 1 version"
    }
  }
};
