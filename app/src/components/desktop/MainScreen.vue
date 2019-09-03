<template>
  <div class="landingpage">
    <ul class="menu">
      <li @click="openFilebrowser()">{{ $t('menubar.open') }}</li>
      <div class="spacer"></div>
      <li class="small">{{ $t('menubar.importJson') }}</li>
      <li class="small" @click="openSettings()">
        {{ $t('menubar.settings') }}
      </li>
      <li class="small" @click="openAbout()">{{ $t('menubar.about') }}</li>
      <div class="spacer"></div>
      <li class="small" @click="openExit()">{{ $t('menubar.exit') }}</li>
    </ul>
    <ul class="filebrowser" ref="filebrowser">
      <li v-bind:key="file" v-for="file in files" @click="openFile(file)">
        {{ file }}
      </li>
    </ul>
    <div class="content">
      <div v-if="saveFolderNotFound" class="saveFolderError">
        Could not locate save folder
      </div>
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
import { DIALOG_SETTINGS, DIALOG_ABOUT } from '../../ts/constants';
import { openFileFromFilesystem } from './openFile';
import { mapActions } from 'vuex';
import { getSaveFilesPath } from './fileUtil';
import { v4 } from 'uuid';

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
    if (this.$store.state.settings.autoLoadSaveFile !== '') {
      this.$router.push({
        path: 'open/auto'
      });
    }

    // Set persisted locale
    const lang = this.$store.state.settings.locale;
    import(`@/lang/${lang}.json`).then(msgs => {
      this.$i18n.setLocaleMessage(lang, msgs.default || msgs);
      this.$i18n.locale = lang;
    });

    // read files

    this.saveFilesPath = getSaveFilesPath();

    const fs = require('fs');

    fs.readdir(this.saveFilesPath, (err, files) => {
      console.log(err);
      if (err) {
        this.saveFolderNotFound = true;
        // TODO: SaveGames folder not found
        return;
      }

      files.forEach(file => {
        this.files.push(file);
        console.log(file);
      });
    });
  },
  methods: {
    ...mapActions(['setLoadedData', 'setProgress', 'setFilename', 'setUUID']),
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

    openFile(file) {
      this.$router.push({
        name: 'progressbar'
      });

      this.setFilename(file);
      const uuid = v4();
      this.setUUID(uuid);

      reportContext('uuid', uuid);
      reportContext('savename', file);

      //      setTimeout(() => {
      console.time('openFile');
      openFileFromFilesystem(
        this.saveFilesPath + '/' + file,
        (err, progress, saveGame) => {
          if (err) {
            // TODO open bug report window
            console.error(err);
            return;
          }

          if (progress) {
            this.setProgress(progress);
            return;
          }

          console.time('setVuex');
          this.setLoadedData(saveGame).then(() => {
            console.timeEnd('setVuex');
            console.timeEnd('openFile');

            this.$router.push({
              name: 'editor'
            });
          });
        }
      );
      //}, 1000);
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
