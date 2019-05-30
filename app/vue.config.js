// properly return 404 errors: https://stackoverflow.com/a/53772122
module.exports = {
  devServer: {
    historyApiFallback: false
  }
};
