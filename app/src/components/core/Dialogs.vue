<template>
  <div class="dialogs">
    <!-- help dialog -->
    <v-dialog v-model="showHelpDialog" width="700" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.help.title') }}</v-card-title>
        <v-card-text>
          <b>{{ $t('dialog.help.controlsTitle') }}</b>
          <p class="helpControls">{{ $t('dialog.help.controlsText') }}</p>
          <p>{{ $t('dialog.help.changeJsonWarning') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showHelpDialog = false">
            {{
            $t('general.close')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- settings dialog -->
    <v-dialog v-model="showSettingsDialog" width="700" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.settings.title') }}</v-card-title>
        <v-card-text>
          <Settings></Settings>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSettingsDialog = false">
            {{
            $t('general.close')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- licenses dialog -->
    <v-dialog v-model="showLicensesDialog" width="700" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.openSource.title') }}</v-card-title>
        <v-card-text>
          <LicensesDialog></LicensesDialog>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showLicensesDialog = false">
            {{
            $t('general.close')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- about dialog -->
    <v-dialog v-model="showAboutDialog" width="600" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.about.title') }}</v-card-title>
        <v-card-text>
          <p>{{ $t('dialog.about.row1') }}</p>
          <p>
            <i18n path="dialog.about.row2">
              <a href="https://github.com/ficsit-felix/ficsit-felix" slot="github">GitHub</a>
            </i18n>
          </p>
          <p>
            <i18n path="dialog.about.row3">
              <a
                href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
                slot="authors"
              >{{ $t('dialog.about.authors') }}</a>
            </i18n>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showAboutDialog = false">{{ $t('general.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- progress dialog-->
    <v-dialog v-model="showProgressDialog" width="600" persistent>
      <ProgressBarDialog></ProgressBarDialog>
    </v-dialog>

    <!-- save web dialog -->
    <ConfirmDialog
      v-model="showSaveWebDialog"
      :title="$t('dialog.save.title')"
      :content="$t('dialog.save.content')"
      @confirm="save()"
    ></ConfirmDialog>

    <!-- save desktop dialog -->
    <ConfirmDialog
      v-model="showSaveDesktopDialog"
      :title="$t('dialog.save.title')"
      :content="$t('dialog.saveDesktop.content')"
      @confirm="save()"
    ></ConfirmDialog>

    <BugReportDialog ref="bugReport" :filename="filename" :uuid="uuid"></BugReportDialog>

    <!-- confirm exit dialog (desktop only) -->
    <ConfirmDialog
      v-model="showConfirmExitDesktopDialog"
      :title="$t('dialog.exit.title')"
      :content="$t('dialog.exit.content')"
      @confirm="exit()"
    ></ConfirmDialog>

    <ConfirmDialog
      v-model="showOpenWebDialog"
      :title="$t('dialog.open.title')"
      :content="$t('dialog.open.content')"
      @confirm="open()"
    ></ConfirmDialog>

    <ConfirmDialog
      v-model="showOpenJsonWebDialog"
      :title="$t('dialog.openJson.title')"
      :content="$t('dialog.openJson.content')"
      @confirm="openJson()"
    ></ConfirmDialog>

    <ConfirmDialog
      v-model="showSaveJsonWebDialog"
      :title="$t('dialog.saveJson.title')"
      :content="$t('dialog.saveJson.content')"
      @confirm="saveJson()"
    ></ConfirmDialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../../event-bus';
import LicensesDialog from './LicensesDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import Settings from './Settings.vue';
import ProgressBarDialog from './ProgressBarDialog.vue';
import BugReportDialog from './BugReportDialog.vue';
import {
  DIALOG_ABOUT,
  DIALOG_HELP,
  DIALOG_OPEN_SOURCE,
  DIALOG_SETTINGS,
  DIALOG_PROGRESS,
  DIALOG_SAVE_WEB,
  ON_SAVE_PRESSED,
  DIALOG_BUGREPORT,
  DIALOG_CONFIRM_EXIT_DESKTOP,
  DIALOG_SAVE_DESKTOP,
  DIALOG_OPEN_WEB,
  DIALOG_OPEN_JSON_WEB,
  DIALOG_SAVE_JSON_WEB,
  ON_SAVE_JSON_PRESSED,
  ON_EXIT_PRESSED
} from '../../ts/constants';
import { setTimeout } from 'timers';
import { mapState } from 'vuex';

// TODO rework this dialog system to avoid repeating code

export default Vue.extend({
  name: 'Dialogs',
  components: {
    LicensesDialog,
    Settings,
    ProgressBarDialog,
    ConfirmDialog,
    BugReportDialog
  },
  data: function() {
    return {
      showHelpDialog: false,
      showSettingsDialog: false,
      showLicensesDialog: false,
      showAboutDialog: false,
      showProgressDialog: false,
      showSaveWebDialog: false,
      showSaveDesktopDialog: false,
      showConfirmExitDesktopDialog: false,
      showOpenWebDialog: false,
      showOpenJsonWebDialog: false,
      showSaveJsonWebDialog: false
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
    EventBus.$on(DIALOG_SAVE_WEB, () => {
      this.closeDialogs(
        this.showSaveWebDialog,
        () => (this.showSaveWebDialog = true)
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
    EventBus.$on(DIALOG_CONFIRM_EXIT_DESKTOP, () => {
      this.closeDialogs(
        this.showConfirmExitDesktopDialog,
        () => (this.showConfirmExitDesktopDialog = true)
      );
    });
    EventBus.$on(DIALOG_OPEN_WEB, () => {
      this.closeDialogs(
        this.showOpenWebDialog,
        () => (this.showOpenWebDialog = true)
      );
    });
    EventBus.$on(DIALOG_OPEN_JSON_WEB, () => {
      this.closeDialogs(
        this.showOpenJsonWebDialog,
        () => (this.showOpenJsonWebDialog = true)
      );
    });
    EventBus.$on(DIALOG_SAVE_JSON_WEB, () => {
      this.closeDialogs(
        this.showSaveJsonWebDialog,
        () => (this.showSaveJsonWebDialog = true)
      );
    });
  },
  beforeDestroy() {
    EventBus.$off(DIALOG_HELP);
    EventBus.$off(DIALOG_OPEN_SOURCE);
    EventBus.$off(DIALOG_ABOUT);
    EventBus.$off(DIALOG_SETTINGS);
    EventBus.$off(DIALOG_PROGRESS);
    EventBus.$off(DIALOG_SAVE_WEB);
    EventBus.$off(DIALOG_SAVE_DESKTOP);
    EventBus.$off(DIALOG_BUGREPORT);
    EventBus.$off(DIALOG_CONFIRM_EXIT_DESKTOP);
    EventBus.$off(DIALOG_OPEN_WEB);
    EventBus.$off(DIALOG_OPEN_JSON_WEB);
    EventBus.$off(DIALOG_SAVE_JSON_WEB);
  },
  methods: {
    closeDialogs(dialogAlreadyOpenDontClose: boolean, callback: () => void) {
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
        this.showSaveWebDialog ||
        this.showSaveDesktopDialog ||
        this.showConfirmExitDesktopDialog ||
        this.showOpenWebDialog ||
        this.showOpenJsonWebDialog ||
        this.showSaveJsonWebDialog;
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
      this.showSaveWebDialog = false;
      this.showSaveDesktopDialog = false;
      this.showConfirmExitDesktopDialog = false;
      this.showOpenWebDialog = false;
      this.showOpenJsonWebDialog = false;
      this.showSaveJsonWebDialog = false;
    },

    open() {
      this.$router.push('open/sav');
    },
    openJson() {
      this.$router.push('open/json');
    },
    save() {
      EventBus.$emit(ON_SAVE_PRESSED);
    },
    saveJson() {
      EventBus.$emit(ON_SAVE_JSON_PRESSED);
    },

    exit() {
      EventBus.$emit(ON_EXIT_PRESSED);
    }
  }
});
</script>
