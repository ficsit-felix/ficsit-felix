const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const webpack = require('webpack');

module.exports = {
  // properly return 404 errors: https://stackoverflow.com/a/53772122
  devServer: {
    historyApiFallback: false
  },
  // To fix "No ESLint configuration found" when using yarn link https://github.com/vuejs/vue-cli/issues/2948#issuecomment-438589725
  chainWebpack: config => config.resolve.symlinks(false),

  // Export version from package.json to environment variable
  // https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c#b970
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ]
  },

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'FICSIT - FeliX',
        win: {
          publisherName: 'bitowl',
          // We don't have a certificate
          verifyUpdateCodeSignature: false
        },
        publish: [
          {
            provider: 'github',
            owner: 'ficsit-felix',
            repo: 'ficsit-felix'
          }
        ],
        nsis: {
          artifactName: 'FICSIT-FeliX-setup.exe'
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
  },
  transpileDependencies: ['vuetify']
};
