<template>
  <div class="dialogs">
    <md-dialog :md-active.sync="showHelpDialog">
      <md-dialog-title>{{ $t('dialog.help.title') }}</md-dialog-title>
      <md-dialog-content>
        <b>{{ $t('dialog.help.controlsTitle') }}</b>
        <p class="helpControls">{{ $t('dialog.help.controlsText') }}</p>
        <p>
          {{ $t('dialog.help.changeJsonWarning') }}
        </p>
        <br />
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showSettingsDialog">
      <md-dialog-title>{{ $t('dialog.settings.title') }}</md-dialog-title>
      <md-dialog-content>
        <Settings></Settings>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showSettingsDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showLicensesDialog">
      <md-dialog-title>{{ $t('dialog.openSource.title') }}</md-dialog-title>
      <md-dialog-content>
        <LicensesDialog></LicensesDialog>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showLicensesDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showAboutDialog">
      <md-dialog-title>{{ $t('dialog.about.title') }}</md-dialog-title>
      <md-dialog-content>
        <p>{{ $t('dialog.about.row1') }}</p>
        <p>
          <i18n path="dialog.about.row2">
            <a
              href="https://github.com/ficsit-felix/ficsit-felix"
              place="github"
              >GitHub</a
            >
          </i18n>
        </p>
        <p>
          <i18n path="dialog.about.row3">
            <a
              href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
              place="authors"
              >{{ $t('dialog.about.authors') }}</a
            >
          </i18n>
        </p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showAboutDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../../event-bus';
import LicensesDialog from './LicensesDialog.vue';
import Settings from './Settings.vue';
import {
  DIALOG_ABOUT,
  DIALOG_HELP,
  DIALOG_OPEN_SOURCE,
  DIALOG_SETTINGS
} from '../../ts/constants';
import { EventBufferer } from 'custom-electron-titlebar/lib/common/event';

export default Vue.extend({
  name: 'Dialogs',
  components: {
    LicensesDialog,
    Settings
  },
  data: function() {
    return {
      showHelpDialog: false,
      showOpenDialog: false,
      showSaveDialog: false,
      showOpenJsonDialog: false,
      showSaveJsonDialog: false,
      showSettingsDialog: false,
      showLicensesDialog: false,
      showAboutDialog: false
    };
  },
  mounted() {
    EventBus.$on(DIALOG_HELP, () => {
      this.showHelpDialog = true;
    });
    EventBus.$on(DIALOG_OPEN_SOURCE, () => {
      this.showLicensesDialog = true;
    });
    EventBus.$on(DIALOG_ABOUT, () => {
      this.showAboutDialog = true;
    });
    EventBus.$on(DIALOG_SETTINGS, () => {
      this.showSettingsDialog = true;
    });
  },
  beforeDestroy() {
    EventBus.$off(DIALOG_HELP);
    EventBus.$off(DIALOG_OPEN_SOURCE);
    EventBus.$off(DIALOG_ABOUT);
    EventBus.$off(DIALOG_SETTINGS);
  },
  methods: {}
});
</script>