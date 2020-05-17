<template>
  <div class="mainmenu" v-if="visible">
    <div class="menu-content">
      <ul class="menu">
        <li @click="saveFile()" v-if="showSaveMenuEntries">
          {{ $t('menubar.save') }}
        </li>
        <li @click="openFilebrowser()">{{ $t('menubar.open') }}</li>

        <div class="spacer"></div>
        <li class="small" @click="exportJson()" v-if="showSaveMenuEntries">
          {{ $t('menubar.exportJson') }}
        </li>
        <li class="small" @click="openJsonFilebrowser()">
          {{ $t('menubar.importJson') }}
        </li>

        <li class="small" @click="openSettings()">
          {{ $t('menubar.settings') }}
        </li>
        <li class="small" @click="openAbout()">{{ $t('menubar.about') }}</li>
        <div class="spacer"></div>
        <li class="small" @click="openExit()">{{ $t('menubar.exit') }}</li>
      </ul>

      <ul class="browser filebrowser" ref="filebrowser" v-if="showFilebrowser">
        <li
          v-bind:key="session.sessionName"
          v-for="session in sortedFiles"
          @click="sessionFiles = session.saves"
        >
          <div class="bar-entry">
            <div class="icon">
              <v-icon v-if="session.saves[0].broken" class="error"
                >mdi-alert-circle</v-icon
              >
              <v-icon v-else>mdi-folder-open</v-icon>
            </div>
            <div class="information">
              <div class="session-name">{{ session.sessionName }}</div>
              <div class="bottom-info">
                <div class="filename">{{ session.saves[0].filename }}</div>
                <!--<div class="last-time">{{ dateToString(session.saves[0].saveDateTime) }}</div>-->
              </div>
            </div>
          </div>
        </li>
      </ul>

      <ul
        class="browser sessionbrowser"
        ref="sessionbrowser"
        v-if="showFilebrowser && sessionFiles.length > 0"
      >
        <li
          v-bind:key="file.filename"
          v-for="file in sessionFiles"
          @click="openFile(file.filepath)"
        >
          <div class="bar-entry">
            <div class="icon">
              <v-icon v-if="file.broken" class="error">mdi-alert-circle</v-icon>
              <v-icon v-else>mdi-content-save</v-icon>
            </div>
            <div class="information">
              <div class="session-name">{{ file.filename }}</div>
              <div class="bottom-info" v-if="file.broken">
                <div class="error">{{ $t('desktop.brokenSaveFile') }}</div>
              </div>
              <div class="bottom-info" v-else>
                <div class="filename">
                  {{ $t('desktop.playDuration') }}
                  {{ secondsToTime(file.playDurationSeconds) }}
                </div>
                <div class="last-time">
                  {{ dateToString(file.saveDateTime) }}
                </div>
                <div class="last-time">{{ bytesToSize(file.size) }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="content">
        <div v-if="saveFolderNotFound" class="saveFolderError">
          Could not locate save folder
        </div>
      </div>
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
  DIALOG_OPEN_TIME_MS,
  DIALOG_CONFIRM_EXIT,
  DIALOG_SAVE,
  DIALOG_SAVE_DESKTOP
} from '../../ts/constants';
import { openFileFromFilesystem } from './openFile';
import { mapActions, mapState } from 'vuex';
import {
  openFileAndMoveToEditor,
  saveFileAndShowProgress
} from './desktopUtils';
import { createReadStream } from 'fs';
import { Component, Vue, Prop } from 'vue-property-decorator';
import fs from 'fs';
import { FileHeaderReader, FileHeader } from './FileHeaderReader';
import moment from 'moment';
import { getSaveGamesFolderPath } from './getSaveGamesFolderPath';
import path from 'path';

@Component({
  computed: {
    ...mapState(['showSaveMenuEntries'])
  } /*,
  watch: {
    showSaveMenuEntries() {
      // update the menu
    }
  }*/
})
export default class DesktopMenu extends Vue {
  @Prop({ default: false }) readonly visible!: boolean;

  private commithash = commithash;
  private files: { [id: string]: FileHeader[] } = {};
  private saveFolderNotFound = false;
  private sessionFiles = [];
  private showFilebrowser = false;
  private version = remote.app.getVersion();

  mounted() {
    // read files

    this.readFiles(getSaveGamesFolderPath());
  }

  readFiles(dir: string) {
    fs.readdir(dir, (err, files) => {
      if (err) {
        this.saveFolderNotFound = true;
        // TODO: SaveGames folder not found
        return;
      }

      files.forEach(file => {
        const filePath = path.resolve(dir, file);

        fs.stat(filePath, (err, stat) => {
          if (stat && stat.isDirectory()) {
            console.log('dir', filePath);
            this.readFiles(filePath);
          } else {
            if (file.endsWith('.sav')) {
              // READ HEADER OF SAVE FILE
              const stream = createReadStream(path.join(filePath));
              new FileHeaderReader(file, filePath, stream, header => {
                // add file size to header
                header.size = stat.size;

                if (this.files[header.sessionName] === undefined) {
                  this.$set(this.files, header.sessionName, []);
                }

                this.files[header.sessionName].push(header);
              });
            }
          }
        });

        console.log(file);
      });
    });
  }
  saveFile() {
    // show confirmation dialog
    EventBus.$emit(DIALOG_SAVE_DESKTOP);
  }

  openFilebrowser() {
    // reload file list TODO do this whenever this menu is shown?
    // this.readFiles(getSaveGamesFolderPath());

    this.showFilebrowser = !this.showFilebrowser;
    if (this.showFilebrowser === false) {
      // also empty the session list
      this.sessionFiles = [];
    }
  }

  exportJson() {
    // TODO deduplicate with DesktopApp.openJsonSaveSelector
    const name = this.$store.state.filename.replace('.sav', '.json');

    remote.dialog
      .showSaveDialog({
        title: this.$t('desktop.saveJsonTitle') as string,
        defaultPath: name,
        filters: [
          {
            name: this.$t('desktop.jsonExtension') as string,
            extensions: ['json']
          }
        ]
      })
      .then(value => {
        if (value.canceled) {
          return;
        }

        saveFileAndShowProgress(this, value.filePath!, true, false);
      });
  }

  openSettings() {
    EventBus.$emit(DIALOG_SETTINGS);
  }
  openAbout() {
    EventBus.$emit(DIALOG_ABOUT);
  }
  openExit() {
    EventBus.$emit(DIALOG_CONFIRM_EXIT);
  }

  openFile(filepath: string) {
    openFileAndMoveToEditor(this, filepath, false);
  }

  openJsonFilebrowser() {
    // TODO deduplicate with openJsonFileSelector in DesktopApp
    remote.dialog
      .showOpenDialog({
        title: this.$t('desktop.openJsonTitle').toString(),
        defaultPath: getSaveGamesFolderPath(),
        filters: [
          {
            name: this.$t('desktop.jsonExtension').toString(),
            extensions: ['json']
          }
        ]
      })
      .then(result => {
        if (result.filePaths.length === 1) {
          this.$router.push('/');
          openFileAndMoveToEditor(this, result.filePaths[0], true);
        }
      });
  }

  /**
   * Formats the last save time
   */
  dateToString(date: Date): string {
    return moment(date)
      .locale(this.$i18n.locale)
      .format('lll');
  }

  /**
   * Formats the current time played
   */
  secondsToTime(seconds: number): string {
    // TODO localize?
    if (seconds < 60) {
      return Math.floor(seconds) + 's';
    }
    seconds /= 60;
    if (seconds < 60) {
      return Math.floor(seconds) + 'm';
    }
    seconds /= 60;
    return Math.floor(seconds) + 'h';
  }
  /**
   * Formats the save game size
   */
  bytesToSize(bytes: number): string {
    // TODO localize?
    // https://stackoverflow.com/a/20732091
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      (bytes / Math.pow(1024, i)).toFixed(2) +
      ' ' +
      ['B', 'kB', 'MB', 'GB', 'TB'][i]
    );
  }

  get sortedFiles() {
    const sortedFiles = [];

    for (const key of Object.keys(this.files)) {
      // sort saves
      this.files[key].sort((a, b) => {
        return b.saveDateTime.getTime() - a.saveDateTime.getTime();
      });

      sortedFiles.push({
        sessionName: key,
        saves: this.files[key]
      });
    }

    // sort sessions
    sortedFiles.sort((a, b) => {
      return (
        b.saves[0].saveDateTime.getTime() - a.saves[0].saveDateTime.getTime()
      );
    });
    return sortedFiles;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.mainmenu {
  width: 100%;
  height: 100%;
  /*height: calc(100% - 30px);*/
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 8;
  background: #00000040;
}

.menu-content {
  display: inline-flex;
  height: 100%;
  flex-direction: row;
  backdrop-filter: blur(10px);
  /*background: #00000040;*/
}
.menu {
  list-style-type: none;
  margin: 0px;
  padding: 80px 0px;
  width: 300px;
  height: 100%;
  background: #00000088;
  /*box-shadow: 10px 0px 7px #00000040;*/
  z-index: 5;
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
      background: #ffa726bb;
    }
  }
  .spacer {
    height: 30px;
  }
}

.browser {
  width: 400px;
  height: 100%;

  margin: 0px;
  padding: 30px 0px;
  &.filebrowser {
    background: #66666620;
    /*box-shadow: 10px 0px 7px #00000040;*/
    z-index: 4;
  }

  &.sessionbrowser {
    background: #ffffff20;
    flex-grow: 1;
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
  bottom: 16px;
  right: 16px;
  color: #ffffff80;
  font-size: 20px;
  line-height: 1.2;
  text-align: right;
}
.commithash {
  font-size: 12px;
  color: #ffffff60;
}

.bar-entry {
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    background: #ffffff20;
    border-radius: 20px;
    border: 1px solid #ffffff30;
    display: inline-block;
    margin-right: 7px;
    padding: 8px;

    .error {
      color: #ff8239;
    }
  }

  .information {
    display: flex;
    flex-direction: column;
  }
}
.error {
  color: #ff8239;
}
</style>
