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
        productName: 'FICSIT - FeliX',
        win: {
          publisherName: 'bitowl'
        },
        publish: [
          {
            provider: 'github',
            owner: 'ficsit-felix',
            repo: 'ficsit-felix'
          }
        ],
        nsis: {
          artifactName: 'FICSIT-FeliX-Setup.exe'
        },
        dmg: {
          artifactName: 'FICSIT-FeliX.dmg'
        },
        mac: {
          target: 'dmg'
        },
        linux: {
          target: 'AppImage',
          executableName: 'ficsit-felix',
          synopsis: 'Save file analyzer for Satisfactory',
          category: 'Game'
        },
        appImage: {
          artifactName: 'FICSIT-FeliX.AppImage'
        }
      }
    }
  }
};
