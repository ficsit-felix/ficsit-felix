<template>
  <div class="dialogs">
    <!-- help dialog -->
    <!-- <md-dialog :md-active.sync="showHelpDialog">
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
    </md-dialog> -->

    <!-- settings dialog -->

    <v-dialog v-model="showSettingsDialog" width="700" scrollable>
      <v-card>
        <v-card-title>
          {{ $t('dialog.settings.title') }}
        </v-card-title>
        <v-card-text>
          <Settings></Settings>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSettingsDialog = false">
            {{ $t('general.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- licenses dialog -->
    <!-- <md-dialog :md-active.sync="showLicensesDialog">
      <md-dialog-title>{{ $t('dialog.openSource.title') }}</md-dialog-title>
      <md-dialog-content>
        <LicensesDialog></LicensesDialog>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showLicensesDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog> -->

    <!-- about dialog -->
    <v-dialog v-model="showAboutDialog" width="600" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.about.title') }}</v-card-title>
        <v-card-text>
          <p>{{ $t('dialog.about.row1') }}</p>
          <p>
            <i18n path="dialog.about.row2">
              <a
                href="https://github.com/ficsit-felix/ficsit-felix"
                slot="github"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn color="primary" text @click="showAboutDialog = false">{{
            $t('general.close')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- progress dialog-->

    <v-dialog v-model="showProgressDialog" width="600" persistent>
      <ProgressBarDialog></ProgressBarDialog>
    </v-dialog>
    <!-- <md-dialog
      :md-active.sync="showProgressDialog"
      :md-click-outside-to-close="false"
      style="width:80%"
    >
      <md-dialog-content>
        <ProgressBarDialog></ProgressBarDialog>
      </md-dialog-content>
    </md-dialog> -->

    <!-- <md-dialog-confirm
      :md-active.sync="showSaveDialog"
      :md-title="$t('dialog.save.title')"
      :md-content="$t('dialog.save.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showSaveDialog = false"
      @md-confirm="save"
      @keydown.enter="
        showSaveDialog = false;
        save();
      "
    />

    <md-dialog-confirm
      :md-active.sync="showSaveDesktopDialog"
      :md-title="$t('dialog.save.title')"
      :md-content="$t('dialog.saveDesktop.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showSaveDesktopDialog = false"
      @md-confirm="save"
      @keydown.enter="
        showSaveDesktopDialog = false;
        save();
      "
    />

    <BugReportDialog
      ref="bugReport"
      :filename="filename"
      :uuid="uuid"
    ></BugReportDialog> -->

    <!-- confirm exit dialog -->
    <v-dialog
      v-model="showConfirmExitDialog"
      width="600"
      @keydown.esc="showConfirmExitDialog = false"
    >
      <v-card>
        <v-card-title>{{ $t('dialog.exit.title') }}</v-card-title>
        <v-card-text>{{ $t('dialog.exit.content') }}</v-card-text>
        <v-card-actions>
          <v-btn></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <md-dialog-confirm
      :md-active.sync="showConfirmExitDialog"
      :md-title="$t('dialog.exit.title')"
      :md-content="$t('dialog.exit.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showConfirmExitDialog = false"
      @md-confirm="exit"
      @keydown.enter="
        showSaveDialog = false;
        exit();
      "
    /> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../../event-bus';
import LicensesDialog from './LicensesDialog.vue';
import Settings from './Settings.vue';
import ProgressBarDialog from './ProgressBarDialog.vue';
import BugReportDialog from './BugReportDialog.vue';
import {
  DIALOG_ABOUT,
  DIALOG_HELP,
  DIALOG_OPEN_SOURCE,
  DIALOG_SETTINGS,
  DIALOG_PROGRESS,
  DIALOG_SAVE,
  ON_SAVE_PRESSED,
  DIALOG_BUGREPORT,
  DIALOG_CONFIRM_EXIT,
  DIALOG_SAVE_DESKTOP
} from '../../ts/constants';
import { EventBufferer } from 'custom-electron-titlebar/lib/common/event';
import { setTimeout } from 'timers';
import { mapState } from 'vuex';
import { remote } from 'electron';

export default Vue.extend({
  name: 'Dialogs',
  components: {
    // LicensesDialog,
    Settings,
    ProgressBarDialog
    // BugReportDialog
  },
  data: function() {
    return {
      showHelpDialog: false,
      showSettingsDialog: false,
      showLicensesDialog: false,
      showAboutDialog: false,
      showProgressDialog: false,
      showSaveDialog: false,
      showSaveDesktopDialog: false,
      showConfirmExitDialog: false
    };
  },
  computed: {
    ...mapState(['filename', 'uuid'])
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
    EventBus.$on(DIALOG_SAVE, () => {
      this.closeDialogs(
        this.showSaveDialog,
        () => (this.showSaveDialog = true)
      );
    });
    EventBus.$on(DIALOG_SAVE_DESKTOP, () => {
      this.closeDialogs(
        this.showSaveDesktopDialog,
        () => (this.showSaveDesktopDialog = true)
      );
    });
    EventBus.$on(DIALOG_BUGREPORT, (errorMessage: string) => {
      this.closeDialogs(false, () => {
        (this.$refs.bugReport as any).openReportWindow(
          this.$t('savePage.error') + ' ' + errorMessage
        );
      });
    });
    EventBus.$on(DIALOG_CONFIRM_EXIT, () => {
      this.closeDialogs(
        this.showConfirmExitDialog,
        () => (this.showConfirmExitDialog = true)
      );
    });
  },
  beforeDestroy() {
    EventBus.$off(DIALOG_HELP);
    EventBus.$off(DIALOG_OPEN_SOURCE);
    EventBus.$off(DIALOG_ABOUT);
    EventBus.$off(DIALOG_SETTINGS);
    EventBus.$off(DIALOG_PROGRESS);
    EventBus.$off(DIALOG_SAVE);
    EventBus.$off(DIALOG_SAVE_DESKTOP);
    EventBus.$off(DIALOG_BUGREPORT);
    EventBus.$off(DIALOG_CONFIRM_EXIT);
  },
  methods: {
    closeDialogs(dialogAlreadyOpenDontClose: boolean, callback: () => void) {
      console.log('closeDialogs', dialogAlreadyOpenDontClose);
      if (dialogAlreadyOpenDontClose === true) {
        callback();
        return;
      }
      const dialogPreviouslyOpen =
        this.showHelpDialog ||
        this.showSettingsDialog ||
        this.showLicensesDialog ||
        this.showAboutDialog ||
        this.showProgressDialog ||
        this.showSaveDialog ||
        this.showSaveDesktopDialog ||
        this.showConfirmExitDialog;
      this.closeAllDialogs();
      if (dialogPreviouslyOpen) {
        // wait for the dialog to close
        setTimeout(callback, 100);
      } else {
        callback();
      }
    },
    closeAllDialogs() {
      this.showHelpDialog = false;
      this.showSettingsDialog = false;
      this.showLicensesDialog = false;
      this.showAboutDialog = false;
      this.showProgressDialog = false;
      this.showSaveDialog = false;
      this.showSaveDesktopDialog = false;
      this.showConfirmExitDialog = false;
    },

    save() {
      EventBus.$emit(ON_SAVE_PRESSED);
    },
    exit() {
      var window = remote.getCurrentWindow();
      window.close();
    }
  }
});
</script>
