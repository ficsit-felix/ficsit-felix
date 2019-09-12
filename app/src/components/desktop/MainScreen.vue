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

    <ul class="filebrowser" ref="filebrowser" v-if="showFilebrowser">
      <li
        v-bind:key="sessionName"
        v-for="(sFiles, sessionName) in files"
        @click="sessionFiles = sFiles"
      >
        <div class="session-name">{{ sessionName }}</div>
        <div class="bottom-info">
          <!-- TODO select newest save file -->
          <div class="filename">{{ sFiles[0].filename }}</div>
          <div class="last-time">{{ dateToString(sFiles[0].saveDateTime) }}</div>
        </div>
      </li>
    </ul>

    <ul
      class="filebrowser sessionbrowser"
      ref="sessionbrowser"
      v-if="showFilebrowser && sessionFiles.length > 0"
    >
      <li v-bind:key="file.filename" v-for="file in sessionFiles" @click="openFile(file.filename)">
        <div class="session-name">{{ file.sessionName }}</div>

        <div class="bottom-info">
          <div class="filename">{{ file.filename }}</div>

          <div class="last-time">{{ dateToString(file.saveDateTime) }}</div>
        </div>
      </li>
    </ul>

    <div class="content">
      <div v-if="saveFolderNotFound" class="saveFolderError">Could not locate save folder</div>
    </div>

    <div class="version">
      {{ version }}
      <div class="commithash">{{ commithash }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import * as Sentry from '@sentry/browser';
import { commithash } from '../../js/commithash';
import { reportMessage, reportContext } from '../../ts/errorReporting';
import CenterWhiteBox from '../core/CenterWhiteBox.vue';
import { app, remote, session } from 'electron';
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import fs from 'fs';
import { FileHeaderReader, FileHeader } from './FileHeaderReader';
import moment from 'moment';

@Component({})
export default class MainScreen extends Vue {
  private commithash = commithash;
  private files: { [id: string]: FileHeader[] } = {};
  private saveFolderNotFound = false;
  private sessionFiles = [];
  private showFilebrowser = false;
  private version = remote.app.getVersion();

  mounted() {
    // hide save menu entries
    this.$store.dispatch('setShowSaveMenuEntries', false);

    if (this.$store.state.settings.autoLoadSaveFile !== '') {
      this.$router.push({
        path: 'open/auto'
      });
    }

    // read files
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
          const stream = createReadStream(
            getSaveGamesFolderPath() + '/' + file
          );
          new FileHeaderReader(file, stream, header => {
            if (this.files[header.sessionName] === undefined) {
              this.$set(this.files, header.sessionName, []);
            }

            this.files[header.sessionName].push(header);
          });
        }
      });

      // TODO sort by sessionSaveDate
    });
  }

  openFilebrowser() {
    this.showFilebrowser = !this.showFilebrowser;
    if (this.showFilebrowser === false) {
      // also empty the session list
      this.sessionFiles = [];
    }
  }
  openSettings() {
    EventBus.$emit(DIALOG_SETTINGS);
  }
  openAbout() {
    EventBus.$emit(DIALOG_ABOUT);
  }
  openExit() {
    var window = remote.getCurrentWindow();
    window.close();
  }

  openFile(name: string) {
    openFileAndMoveToEditor(this, getSaveGamesFolderPath() + '/' + name, false);
  }

  openJsonFilebrowser() {
    // TODO deduplicate with openJsonFileSelector in DesktopApp
    remote.dialog.showOpenDialog(
      {
        title: this.$t('desktop.openJsonTitle').toString(),
        defaultPath: getSaveGamesFolderPath(),
        filters: [
          {
            name: this.$t('desktop.jsonExtension').toString(),
            extensions: ['json']
          }
        ]
      },
      (filePaths: any) => {
        if (filePaths.length === 1) {
          this.$router.push({
            name: '/'
          });
          openFileAndMoveToEditor(this, filePaths[0], true);
        }
      }
    );
  }

  dateToString(date: Date): string {
    return moment(date)
      .locale(this.$i18n.locale)
      .format('lll');
  }
}
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
  &.sessionbrowser {
    background: #cccccc33;
  }

  li {
    list-style-type: none;
    padding: 10px 20px;
    cursor: pointer;
    user-select: none;
    font-size: 20px;

    &:hover {
      background: #ffffff20;
    }
    .session-name {
      color: #fff;
    }

    .bottom-info {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      color: #ddd;
      padding-top: 2px;
    }
    .filename {
      font-weight: bold;
    }
    .last-time {
      padding-left: 10px;
      white-space: nowrap;
    }
  }
  overflow-y: auto;
  overflow-x: hidden;
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

.version {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #666;
  font-size: 20px;
  line-height: 1.2;
}
.commithash {
  font-size: 12px;
  color: #555;
}
</style>
