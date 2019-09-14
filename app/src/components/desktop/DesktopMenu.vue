<template>
  <div class="mainmenu" v-if="visible">
    <ul class="menu">
      <li @click="openFilebrowser()">{{ $t('menubar.open') }}</li>
      <div class="spacer"></div>
      <li class="small" @click="openJsonFilebrowser()">{{ $t('menubar.importJson') }}</li>
      <li class="small" @click="openSettings()">{{ $t('menubar.settings') }}</li>
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
        <div class="session-name">{{ session.sessionName }}</div>
        <div class="bottom-info">
          <div class="filename">{{ session.saves[0].filename }}</div>
          <div class="last-time">{{ dateToString(session.saves[0].saveDateTime) }}</div>
        </div>
      </li>
    </ul>

    <ul
      class="browser sessionbrowser"
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
    <div class="version">
      {{ version }}
      <div class="commithash">{{ commithash }}</div>
    </div>
    <div class="content">
      <div v-if="saveFolderNotFound" class="saveFolderError">Could not locate save folder</div>
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
  DIALOG_CONFIRM_EXIT
} from '../../ts/constants';
import { openFileFromFilesystem } from './openFile';
import { mapActions } from 'vuex';
import { openFileAndMoveToEditor } from './desktopUtils';
import { createReadStream } from 'fs';
import { Component, Vue, Prop } from 'vue-property-decorator';
import fs from 'fs';
import { FileHeaderReader, FileHeader } from './FileHeaderReader';
import moment from 'moment';
import { getSaveGamesFolderPath } from './getSaveGamesFolderPath';

@Component({})
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
    EventBus.$emit(DIALOG_CONFIRM_EXIT);
  }

  openFile(name: string) {
    this.$router.push({
      name: '/'
    });
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
  display: flex;
  flex-direction: row;
  position: absolute;
  z-index: 8;
  backdrop-filter: blur(4px);
  background: #00000040;
}

.menu {
  list-style-type: none;
  margin: 0px;
  padding: 80px 0px;
  width: 300px;
  height: 100%;
  background: #3e3f40cc;
  box-shadow: 10px 0px 7px #00000040;
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
      background: #e59345bb;
    }
  }
  .spacer {
    height: 30px;
  }
}

.browser {
  width: 300px;
  height: 100%;

  margin: 0px;
  padding: 30px 0px;
  &.filebrowser {
    background: #00000030;
    box-shadow: 10px 0px 7px #00000040;
    z-index: 4;
  }

  &.sessionbrowser {
    background: #00000020;
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
