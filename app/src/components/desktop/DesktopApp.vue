<template>
  <div id="app">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="titlebar-logo"
    >
      <Logo :height="25" black="#505050" :animating="logoAnimating"></Logo>
    </div>
    <router-view />
    <Dialogs></Dialogs>
  </div>
</template>

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

<script>
import '@/assets/main.scss';
import Logo from '../core/Logo.vue';
import Dialogs from '../core/Dialogs.vue';
import { Titlebar, Color } from 'custom-electron-titlebar';
import Vue from 'vue';
import { dialog, remote, shell } from 'electron';

const { Menu, MenuItem } = require('electron').remote;
import {
  getSaveGamesFolderPath,
  openFileAndMoveToEditor,
  saveFileAndShowProgress
} from './desktopUtils';
import { EventBus } from '../../event-bus';
import {
  DIALOG_ABOUT,
  DIALOG_OPEN_SOURCE,
  DIALOG_HELP,
  DIALOG_SETTINGS,
  CHANGE_LOCALE
} from '../../ts/constants';
import { debug } from 'util';
import { mapState } from 'vuex';

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
      backgroundColor: Color.fromHex('#16161d'),
      itemBackgroundColor: Color.fromHex('#26262d')
    });
    this.titlebar.updateTitle('FICSIT - FeliX');
    this.setDefaultMenu();
    EventBus.$on(CHANGE_LOCALE, this.onChangeLocale);
  },
  beforeDestroy() {
    EventBus.$off(CHANGE_LOCALE, this.onChangeLocale);
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
          accelerator: 'Ctrl+O',
          click: () => {
            this.openFileSelector();
          }
        },
        {
          label: this.$t('menubar.importJson'),
          accelerator: 'Ctrl+Shift+O',
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
            click: () => {
              this.$router.push('save/sav');
            }
          },
          {
            label: this.$t('menubar.exportJson'),
            click: () => {
              this.openJsonSaveSelector();
              // this.$router.push('save/json');
            }
          }
        ]);
      }

      fileEntries = fileEntries.concat([
        {
          type: 'separator'
        },
        {
          label: this.$t('menubar.settings'),
          click() {
            EventBus.$emit(DIALOG_SETTINGS);
          }
        },
        {
          label: this.$t('menubar.mainScreen'),
          click() {
            self.$router.push('/');
          }
        },
        {
          label: this.$t('menubar.exit'),
          accelerator: 'Ctrl+Q',
          click() {
            var window = remote.getCurrentWindow();
            window.close();
          }
        }
      ]);

      menu.append(
        new MenuItem({
          label: this.$t('menubar.file'),
          submenu: fileEntries
        })
      );

      menu.append(
        new MenuItem({
          label: this.$t('menubar.help'),
          submenu: [
            {
              label: this.$t('menubar.help'),
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
    },
    openFileSelector() {
      remote.dialog.showOpenDialog(
        {
          title: this.$t('desktop.openSavTitle'),
          defaultPath: getSaveGamesFolderPath(),
          filters: [
            {
              name: this.$t('desktop.saveExtension'),
              extensions: ['sav']
            }
          ]
        },
        filePaths => {
          console.log(filePaths);
          if (filePaths.length === 1) {
            this.$router.push({
              name: '/'
            });
            openFileAndMoveToEditor(this, filePaths[0], false);
          }
        }
      );
    },
    openJsonFileSelector() {
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
    }
  }
};
</script>
