<template>
  <div class="dialogs">
    <!-- help dialog -->
    <md-dialog :md-active.sync="showHelpDialog">
      <md-dialog-title>{{ $t('dialog.help.title') }}</md-dialog-title>
      <md-dialog-content>
        <b>{{ $t('dialog.help.controlsTitle') }}</b>
        <p class="helpControls">{{ $t('dialog.help.controlsText') }}</p>
        <p>{{ $t('dialog.help.changeJsonWarning') }}</p>
        <br />
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- settings dialog -->
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

    <!-- licenses dialog -->
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

    <!-- about dialog -->
    <md-dialog :md-active.sync="showAboutDialog">
      <md-dialog-title>{{ $t('dialog.about.title') }}</md-dialog-title>
      <md-dialog-content>
        <p>{{ $t('dialog.about.row1') }}</p>
        <p>
          <i18n path="dialog.about.row2">
            <a href="https://github.com/ficsit-felix/ficsit-felix" slot="github"
              >GitHub</a
            >
          </i18n>
        </p>
        <p>
          <i18n path="dialog.about.row3">
            <a
              href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
              slot="authors"
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

    <!-- progress dialog-->
    <md-dialog
      :md-active.sync="showProgressDialog"
      :md-click-outside-to-close="false"
      style="width:80%"
    >
      <!--<md-dialog-title>{{ $t('dialog.progress.title') }}</md-dialog-title>-->
      <md-dialog-content>
        <ProgressBarDialog></ProgressBarDialog>
      </md-dialog-content>
      <md-dialog-actions>
        <!--<md-button class="md-primary" @click="showProgressDialog = false">{{ $t('general.close') }}</md-button>-->
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../../event-bus';
import LicensesDialog from './LicensesDialog.vue';
import Settings from './Settings.vue';
import ProgressBarDialog from './ProgressBarDialog.vue';
import {
  DIALOG_ABOUT,
  DIALOG_HELP,
  DIALOG_OPEN_SOURCE,
  DIALOG_SETTINGS,
  DIALOG_PROGRESS
} from '../../ts/constants';
import { EventBufferer } from 'custom-electron-titlebar/lib/common/event';
import { setTimeout } from 'timers';

export default Vue.extend({
  name: 'Dialogs',
  components: {
    LicensesDialog,
    Settings,
    ProgressBarDialog
  },
  data: function() {
    return {
      showHelpDialog: false,
      showSettingsDialog: false,
      showLicensesDialog: false,
      showAboutDialog: false,
      showProgressDialog: false
    };
  },
  mounted() {
    EventBus.$on(DIALOG_HELP, () => {
      this.closeDialogs(
        this.showHelpDialog,
        () => (this.showHelpDialog = true)
      );
    });
    EventBus.$on(DIALOG_OPEN_SOURCE, () => {
      this.closeDialogs(
        this.showLicensesDialog,
        () => (this.showLicensesDialog = true)
      );
    });
    EventBus.$on(DIALOG_ABOUT, () => {
      this.closeDialogs(
        this.showAboutDialog,
        () => (this.showAboutDialog = true)
      );
    });
    EventBus.$on(DIALOG_SETTINGS, () => {
      this.closeDialogs(
        this.showSettingsDialog,
        () => (this.showSettingsDialog = true)
      );
    });
    EventBus.$on(DIALOG_PROGRESS, (val: boolean) => {
      if (val) {
        this.closeDialogs(
          this.showProgressDialog,
          () => (this.showProgressDialog = val)
        );
      } else {
        this.showProgressDialog = false;
      }
    });
  },
  beforeDestroy() {
    EventBus.$off(DIALOG_HELP);
    EventBus.$off(DIALOG_OPEN_SOURCE);
    EventBus.$off(DIALOG_ABOUT);
    EventBus.$off(DIALOG_SETTINGS);
    EventBus.$off(DIALOG_PROGRESS);
  },
  methods: {
    closeDialogs(closeDialogs: boolean, callback: () => void) {
      console.log('closeDialogs', closeDialogs);
      if (closeDialogs === true) {
        callback();
        return;
      }
      const dialogPreviouslyOpen =
        this.showHelpDialog ||
        this.showSettingsDialog ||
        this.showLicensesDialog ||
        this.showAboutDialog ||
        this.showProgressDialog;
      this.showHelpDialog = false;
      this.showSettingsDialog = false;
      this.showLicensesDialog = false;
      this.showAboutDialog = false;
      this.showProgressDialog = false;
      if (dialogPreviouslyOpen) {
        // wait for the dialog to close
        setTimeout(callback, 100);
      } else {
        callback();
      }
    }
  }
});
</script>
