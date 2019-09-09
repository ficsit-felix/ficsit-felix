<template>
  <div class="landingpage">
    <ul class="menu">
      <li @click="openFilebrowser()">{{ $t('menubar.open') }}</li>
      <div class="spacer"></div>
      <li class="small" @click="openJsonFilebrowser()">{{ $t('menubar.importJson') }}</li>
      <li class="small" @click="openSettings()">{{ $t('menubar.settings') }}</li>
      <li class="small" @click="openAbout()">{{ $t('menubar.about') }}</li>
      <div class="spacer"></div>
      <li class="small" @click="openExit()">{{ $t('menubar.exit') }}</li>
    </ul>
    <ul class="filebrowser" ref="filebrowser">
      <li
        v-bind:key="file.filename"
        v-for="file in files"
        @click="openFile(file)"
      >{{ file.filename }}</li>
    </ul>
    <div class="content">
      <div v-if="saveFolderNotFound" class="saveFolderError">Could not locate save folder</div>
    </div>
  </div>
</template>

<script>
import * as Sentry from '@sentry/browser';
import { commithash } from '@/js/commithash';
import { reportMessage, reportContext } from '@/ts/errorReporting';
import CenterWhiteBox from '@/components/core/CenterWhiteBox';
import { app, remote } from 'electron';
import electron from 'electron';
import { EventBus } from '../../event-bus';
import {
  DIALOG_SETTINGS,
  DIALOG_ABOUT,
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS
} from '../../ts/constants';
import { openFileFromFilesystem } from './openFile';
import { mapActions } from 'vuex';
import {
  getSaveGamesFolderPath,
  openFileAndMoveToEditor
} from './desktopUtils';
import { createReadStream } from 'fs';

export default {
  name: 'MainScreen',
  data: function() {
    return {
      commithash: commithash,
      files: [],
      saveFolderNotFound: false
    };
  },
  mounted() {
    // hide save menu entries
    this.setShowSaveMenuEntries(false);

    if (this.$store.state.settings.autoLoadSaveFile !== '') {
      this.$router.push({
        path: 'open/auto'
      });
    }

    // read files

    const fs = require('fs');

    fs.readdir(getSaveGamesFolderPath(), (err, files) => {
      console.log(err);
      if (err) {
        this.saveFolderNotFound = true;
        // TODO: SaveGames folder not found
        return;
      }

      files.forEach(file => {
        if (file.endsWith('.sav')) {
          // READ HEADER OF SAVE FILE
          console.log('read ', file);
          const stream = createReadStream(
            getSaveGamesFolderPath() + '/' + file
          );
          stream.on('readable', () => {
            function readInt() {
              const data = stream.read(4);
              return data.readInt32LE(0);
            }

            // TODO: add this into satisfactory-json
            function readString() {
              let length = readInt();
              if (length === 0) {
                return '';
              }
              let utf16 = false;
              if (length < 0) {
                // Thanks to @Goz3rr we know that this is now an utf16 based string
                // throw new Error('length of string < 0: ' + length);
                length = -2 * length;
                utf16 = true;
              }
              let resultStr;
              if (utf16) {
                const result = stream.read(length - 2);
                resultStr = this.decodeUTF16LE(result.toString('binary'));
              } else {
                const result = stream.read(length - 1);
                resultStr = result.toString('utf8');
              }
              if (utf16) {
                assertNullByte();
                //this.assertNullByteString(length, resultStr); // two null bytes for utf16
              }
              assertNullByte();
              //this.assertNullByteString(length, resultStr);
              return resultStr;
            }

            function assertNullByte() {
              const data = stream.read(1);
              if (data[0] !== 0) {
                console.error('NOT ZERO, but ', data);
              }
            }

            function readLong() {
              const data = stream.read(8);
              return data.toString('hex');
            }

            function readByte() {
              const data = stream.read(1);
              return data.readUInt8(0);
            }

            try {
              const header = {
                filename: file,
                saveHeaderType: readInt(),
                saveVersion: readInt(),
                buildVersion: readInt(),
                mapName: readString(),
                mapOptions: readString(),
                sessionName: readString(),
                playDurationSeconds: readInt(),
                saveDateTime: readLong(),
                sessionVisibility: readByte()
              };

              this.files.push(header);
            } catch (e) {
              // TODO do we want to inform the user about broken saves?
              // maybe add a red X icon next to them?
              console.warn(e);
            }
            /*
  ar.transformInt(saveGame.saveHeaderType);
  ar.transformInt(saveGame.saveVersion);
  ar.transformInt(saveGame.buildVersion);
  ar.transformString(saveGame.mapName);
  ar.transformString(saveGame.mapOptions);
  ar.transformString(saveGame.sessionName);
  ar.transformInt(saveGame.playDurationSeconds);
  ar.transformLong(saveGame.saveDateTime);
  if (saveGame.saveHeaderType > 4) {
    ar.transformByte(saveGame.sessionVisibility);
  }
*/
            //stream.read(1);
            stream.close();
          });
          console.log(stream);
        }
        //console.log(file);
      });
    });
  },
  methods: {
    ...mapActions([
      'setLoadedData',
      'setProgress',
      'setFilename',
      'setUUID',
      'setShowSaveMenuEntries',
      'setProgressText'
    ]),
    openFilebrowser() {
      const filebrowser = this.$refs.filebrowser;
      if (filebrowser.classList.contains('visible')) {
        filebrowser.classList.remove('visible');
      } else {
        filebrowser.classList.add('visible');
      }
    },
    openSettings() {
      EventBus.$emit(DIALOG_SETTINGS);
    },
    openAbout() {
      EventBus.$emit(DIALOG_ABOUT);
    },
    openExit() {
      var window = remote.getCurrentWindow();
      window.close();
    },

    openFile(name) {
      openFileAndMoveToEditor(
        this,
        getSaveGamesFolderPath() + '/' + name,
        false
      );
    },

    openJsonFilebrowser() {
      // TODO deduplicate with openJsonFileSelector in DesktopApp
      remote.dialog.showOpenDialog(
        {
          title: this.$t('desktop.openJsonTitle'),
          defaultPath: getSaveGamesFolderPath(),
          filters: [
            {
              name: this.$t('desktop.jsonExtension'),
              extensions: ['json']
            }
          ]
        },
        filePaths => {
          if (filePaths.length === 1) {
            this.$router.push({
              name: '/'
            });
            openFileAndMoveToEditor(this, filePaths[0], true);
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.landingpage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.menu {
  list-style-type: none;
  margin: 0px;
  padding: 80px 0px;
  width: 300px;
  height: 100%;
  background: #3e3f4022;
  li {
    margin: 0px;
    padding: 20px 40px;
    font-size: 24px;
    font-weight: 100;
    cursor: pointer;
    user-select: none;
    color: #fff;
    &.small {
      font-size: 18px;
      padding: 10px 40px;
    }
    &:hover {
      background: #e59345bb;
    }
  }
  .spacer {
    height: 30px;
  }
}

.filebrowser {
  width: 300px;
  height: 100%;
  background: #cccccc22;
  margin: 0px;
  padding: 30px 0px;
  li {
    list-style-type: none;
    padding: 10px 20px;
    cursor: pointer;
    user-select: none;
    font-size: 20px;

    &:hover {
      background: #ffffff20;
    }
  }
  overflow-y: auto;
  overflow-x: hidden;
  display: none;

  &.visible {
    display: block;
  }
}

.content {
  flex-grow: 1;
}

.saveFolderError {
  background: $primaryOrange;
  color: #222;
  padding: 8px 16px;
  font-size: 18px;
  margin: 30px 20px;
  box-sizing: border-box;
  border-radius: 5px;
}
</style>
