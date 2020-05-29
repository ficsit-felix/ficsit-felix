<template>
  <div id="app">
    <v-app>
      <div
        @mouseover="logoAnimating = true"
        @mouseleave="logoAnimating = false"
        class="titlebar-logo"
      >
        <Logo :height="25" black="#505050" :animating="logoAnimating"></Logo>
      </div>
      <router-view />
      <Dialogs></Dialogs>
    </v-app>
  </div>
</template>

<script>
import '@/assets/main.scss';
import Logo from '../core/Logo.vue';
import Dialogs from '../core/Dialogs.vue';
import { Titlebar, Color } from 'custom-electron-titlebar';
import Vue from 'vue';
import { dialog, remote, shell } from 'electron';

const { Menu, MenuItem } = require('electron').remote;
import {
  openFileAndMoveToEditor,
  saveFileAndShowProgress
} from './desktopUtils';
import { getSaveGamesFolderPath } from './getSaveGamesFolderPath';
import { EventBus } from '../../event-bus';
import {
  DIALOG_ABOUT,
  DIALOG_OPEN_SOURCE,
  DIALOG_HELP,
  DIALOG_SETTINGS,
  CHANGE_LOCALE,
  ON_SAVE_PRESSED,
  TOGGLE_MENU,
  DIALOG_SAVE_DESKTOP,
  DIALOG_CONFIRM_EXIT_DESKTOP,
  ON_EXIT_PRESSED
} from '../../ts/constants';
import { debug } from 'util';
import { mapState } from 'vuex';
import path from 'path';

export default {
  name: 'DesktopApp',
  components: {
    Logo,
    Dialogs
  },
  data: function() {
    return {
      logoAnimating: false
    };
  },
  computed: {
    ...mapState(['showSaveMenuEntries'])
  },
  watch: {
    showSaveMenuEntries() {
      // update the menu
      this.setDefaultMenu();
    }
  },
  mounted() {
    this.titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#111618'),
      itemBackgroundColor: Color.fromHex('#1d2223'),
      enableMnemonics: true,
      unfocusEffect: false // don't change the color when the window is not focussed
    });
    this.titlebar.updateTitle('FICSIT - FeliX');

    this.setDefaultMenu();

    EventBus.$on(CHANGE_LOCALE, this.onChangeLocale);

    EventBus.$on(ON_SAVE_PRESSED, this.onSavePressed);
    EventBus.$on(ON_EXIT_PRESSED, this.onExitPressed);
  },
  beforeDestroy() {
    EventBus.$off(CHANGE_LOCALE, this.onChangeLocale);
    EventBus.$off(ON_SAVE_PRESSED, this.onSavePressed);
    EventBus.$off(ON_EXIT_PRESSED, this.onExitPressed);
    this.titlebar.dispose();
  },
  methods: {
    onChangeLocale() {
      this.setDefaultMenu(); // TODO rebuild the currently selected menu
    },
    setDefaultMenu() {
      const menu = new Menu();

      let fileEntries = [
        {
          label: this.$t('menubar.open'),
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            this.openFileSelector();
          }
        },
        {
          label: this.$t('menubar.importJson'),
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => this.openJsonFileSelector()
        }
      ];

      if (this.showSaveMenuEntries) {
        fileEntries = fileEntries.concat([
          {
            type: 'separator'
          },
          {
            label: this.$t('menubar.save'),
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.saveFile();
            }
          },
          {
            label: this.$t('menubar.saveAs'),
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
              this.openSaveSaveSelector();
            }
          },
          {
            label: this.$t('menubar.exportJson'),
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              this.openJsonSaveSelector();
            }
          }
        ]);
      }

      fileEntries = fileEntries.concat([
        {
          type: 'separator'
        },
        { role: 'togglefullscreen' },
        {
          label: this.$t('menubar.settings'),
          click() {
            EventBus.$emit(DIALOG_SETTINGS);
          }
        }
      ]);
      if (this.showSaveMenuEntries) {
        fileEntries.push({
          label: this.$t('menubar.toggleMenu'),
          accelerator: 'Esc',
          click: () => {
            EventBus.$emit(TOGGLE_MENU);
          }
        });
      }

      fileEntries.push({
        label: this.$t('menubar.exit'),
        accelerator: 'Ctrl+Q',
        click() {
          EventBus.$emit(DIALOG_CONFIRM_EXIT_DESKTOP);
        }
      });

      menu.append(
        new MenuItem({
          label: this.$t('menubar.file'),
          submenu: fileEntries
        })
      );

      if (remote.process.env.NODE_ENV === 'development') {
        // Add develoment menu entries
        menu.append(
          new MenuItem({
            label: 'Develop',
            submenu: [
              { role: 'reload' },
              { role: 'forcereload' },
              { role: 'toggledevtools' }
            ]
          })
        );
      }

      menu.append(
        new MenuItem({
          label: this.$t('menubar.help'),
          submenu: [
            {
              label: this.$t('menubar.help'),
              accelerator: 'F1',
              click() {
                EventBus.$emit(DIALOG_HELP);
              }
            },
            {
              label: this.$t('menubar.github'),
              click() {
                shell.openExternal(
                  'https://github.com/ficsit-felix/ficsit-felix'
                );
              }
            },
            {
              label: this.$t('menubar.openSource'),
              click() {
                EventBus.$emit(DIALOG_OPEN_SOURCE);
              }
            },
            {
              label: this.$t('menubar.about'),
              click() {
                EventBus.$emit(DIALOG_ABOUT);
              }
            } /*
            {
              type: 'separator'
            },
            {
              label: 'Subitem with submenu',
              submenu: [
                {
                  label: 'Submenu &item 1',
                  accelerator: 'Ctrl+T'
                }
              ]
            }*/
          ]
        })
      );

      this.titlebar.updateMenu(menu);
      Menu.setApplicationMenu(menu);
    },
    openFileSelector() {
      remote.dialog
        .showOpenDialog({
          title: this.$t('desktop.openSavTitle'),
          defaultPath: getSaveGamesFolderPath(),
          filters: [
            {
              name: this.$t('desktop.saveExtension'),
              extensions: ['sav']
            }
          ]
        })
        .then(value => {
          console.log(value.filePaths);
          if (value.filePaths.length === 1) {
            openFileAndMoveToEditor(this, value.filePaths[0], false);
          }
        });
    },
    openJsonFileSelector() {
      // TODO deduplicate with openJsonFilebrowser in MainScreen
      remote.dialog
        .showOpenDialog({
          title: this.$t('desktop.openJsonTitle'),
          defaultPath: getSaveGamesFolderPath(),
          filters: [
            {
              name: this.$t('desktop.jsonExtension'),
              extensions: ['json']
            }
          ]
        })
        .then(value => {
          if (value.filePaths.length === 1) {
            openFileAndMoveToEditor(this, value.filePaths[0], true);
          }
        });
    },
    openJsonSaveSelector() {
      const name = this.$store.state.filename.replace('.sav', '.json');

      remote.dialog
        .showSaveDialog({
          title: this.$t('desktop.saveJsonTitle'),
          defaultPath: name,
          filters: [
            {
              name: this.$t('desktop.jsonExtension'),
              extensions: ['json']
            }
          ]
        })
        .then(value => {
          if (value.canceled) {
            return;
          }

          saveFileAndShowProgress(this, value.filePath, true, false);
        });
    },

    // save the file to the place where it was previously stored
    saveFile() {
      // show confirmation dialog
      EventBus.$emit(DIALOG_SAVE_DESKTOP);
    },

    onSavePressed() {
      // TODO maybe store to the location the file was actually loaded from?
      saveFileAndShowProgress(
        this,
        /*path.join(
          getSaveGamesFolderPath(),*/
        this.$store.state.filepath.replace('.json', '.sav'),
        //),
        false,
        false
      );
    },

    openSaveSaveSelector() {
      const name = this.$store.state.filename.replace('.json', '.sav');

      remote.dialog
        .showSaveDialog({
          title: this.$t('desktop.saveSaveTitle'),
          defaultPath: name,
          filters: [
            {
              name: this.$t('desktop.saveExtension'),
              extensions: ['sav']
            }
          ]
        })
        .then(value => {
          if (value.canceled) {
            return;
          }

          saveFileAndShowProgress(this, value.filePath, false, false);
        });
    },
    onExitPressed() {
      let window = remote.getCurrentWindow();
      window.close();
    }
  }
};
</script>
<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #adadad;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.titlebar-logo {
  display: inline-block;
  position: fixed;
  margin-top: -30px;
  left: 10px;
  z-index: 100000;
  -webkit-app-region: no-drag;
}
</style>
