module.exports = {
  // properly return 404 errors: https://stackoverflow.com/a/53772122
  devServer: {
    historyApiFallback: false
  },
  // To fix "No ESLint configuration found" when using yarn link https://github.com/vuejs/vue-cli/issues/2948#issuecomment-438589725
  chainWebpack: config => config.resolve.symlinks(false),

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "FICSIT - FeliX",
        win: {
          publisherName: "bitowl"
        }
      }
    }
  }
};
