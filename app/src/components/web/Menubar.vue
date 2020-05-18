<template>
  <div class="menubar">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="logoContainer"
    >
      <Logo :height="48" black="#707070" :animating="logoAnimating"></Logo>
    </div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showOpenDialog = true"
          v-shortkey.once="['ctrl', 'o']"
          @shortkey="showOpenDialog = true"
          v-on="on"
        >
          <v-icon>mdi-home</v-icon>
          {{ $t('menubar.open') }}
        </span>
      </template>
      {{ $t('keyboard.ctrl') }}+O
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showSaveDialog = true"
          v-shortkey.once="['ctrl', 's']"
          @shortkey="showSaveDialog = true"
          v-on="on"
        >
          <v-icon>mdi-content-save</v-icon>
          {{ $t('menubar.save') }}
        </span>
      </template>
      {{ $t('keyboard.ctrl') }}+S
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showHelpDialog()"
          v-shortkey.once="['f1']"
          @shortkey="showHelpDialog()"
          v-on="on"
        >
          <v-icon>mdi-help-circle</v-icon>
          {{ $t('menubar.help') }}
        </span>
      </template>
      F1
    </v-tooltip>
    <span class="menu-item" @click="showSettingsDialog()">
      <v-icon>mdi-cog</v-icon>
      {{ $t('menubar.settings') }}
    </span>
    <div class="spacer"></div>

    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon left>mdi-menu</v-icon>
          {{ $t('menubar.more') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="showOpenJsonDialog = true">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.importJson') }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="showSaveJsonDialog = true">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.exportJson') }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="openGithub()">
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.github') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showLicensesDialog = true">
          <v-list-item-icon>
            <v-icon>mdi-view-headline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.openSource') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showAboutDialog()">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.about') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- TODO
    <md-dialog-confirm
      :md-active.sync="showOpenDialog"
      :md-title="$t('dialog.open.title')"
      :md-content="$t('dialog.open.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showOpenDialog = false"
      @md-confirm="open"
      @keydown.enter="
        showOpenDialog = false;
        open();
      "
    />

    <md-dialog-confirm
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
      :md-active.sync="showOpenJsonDialog"
      :md-title="$t('dialog.openJson.title')"
      :md-content="$t('dialog.openJson.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showOpenJsonDialog = false"
      @md-confirm="openJson"
      @keydown.enter="
        showOpenJsonDialog = false;
        openJson();
      "
    />

    <md-dialog-confirm
      :md-active.sync="showSaveJsonDialog"
      :md-title="$t('dialog.saveJson.title')"
      :md-content="$t('dialog.saveJson.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showSaveJsonDialog = false"
      @md-confirm="saveJson"
      @keydown.enter="
        showSaveJsonDialog = false;
        saveJson();
      "
    />

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


    -->
  </div>
</template>

<script>
import Logo from '../core/Logo';
import LicensesDialog from '../core/LicensesDialog';
import Settings from '../core/Settings';
import { findActorByName } from '@/helpers/entityHelper';
import { EventBus } from '../../event-bus';
import { DIALOG_ABOUT, DIALOG_SETTINGS, DIALOG_HELP } from '../../ts/constants';

export default {
  name: 'Menubar',
  components: {
    Logo
    //LicensesDialog,
    //Settings
  },
  data: function() {
    return {
      logoAnimating: false,
      showOpenDialog: false,
      showSaveDialog: false,
      showOpenJsonDialog: false,
      showSaveJsonDialog: false,
      showLicensesDialog: false
    };
  },
  methods: {
    open() {
      this.$router.push('open/sav');
    },
    openJson() {
      this.$router.push('open/json');
    },
    save() {
      this.$router.push('save/sav');
    },
    saveJson() {
      this.$router.push('save/json');
    },
    openGithub() {
      window.open('https://github.com/ficsit-felix/ficsit-felix', '_blank');
    },
    showAboutDialog() {
      EventBus.$emit(DIALOG_ABOUT);
    },
    showSettingsDialog() {
      EventBus.$emit(DIALOG_SETTINGS);
    },
    showHelpDialog() {
      EventBus.$emit(DIALOG_HELP);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.menubar {
  display: flex;
  background: $surface;
  flex-shrink: 0;
  padding-left: 30px;
  padding-right: 30px;
  user-select: none;
  align-items: center;
  .logoContainer {
    margin-right: 60px;
  }

  .spacer {
    flex-grow: 1;
  }
  span.menu-item {
    display: inline-block;
    padding: 10px 10px;
    padding-right: 20px;
    font-size: 16px;
    line-height: 33px;
    i {
      padding-right: 5px;
    }
    color: #e3d3d3;
    transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  span:hover {
    color: $primaryOrange;
    cursor: pointer;
    .v-icon {
      color: $primaryOrange;
    }
  }
}
p,
b {
  padding: 0px 16px;
}
</style>

<style lang="scss">
// TODO rewrite to scoped using ::v-deep https://stackoverflow.com/a/55368933
.menubar {
  .md-menu > .md-button {
    margin: 8px;
    text-transform: none;
    font-size: 16px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #e3d3d3;
  }
}
.menubar-content {
  .md-list-item-content {
    justify-content: left !important;
  }
  .md-list-item-content > .v-icon:last-child {
    margin-left: 0px;
  }
  .md-list-item-content > .v-icon:first-child {
    margin-right: 12px;
  }
}

.md-dialog-content .helpControls {
  white-space: pre-line;
}
</style>
