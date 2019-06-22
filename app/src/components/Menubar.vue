<template>
  <div class="menubar">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="logoContainer"
    >
      <Logo :height="48" black="#707070" :animating="logoAnimating"></Logo>
    </div>
    <span
      @click="showOpenDialog = true"
      v-shortkey.once="['ctrl', 'o']"
      @shortkey="showOpenDialog = true"
    >
      <md-icon>folder_open</md-icon>{{ $t("menubar.open")
      }}<md-tooltip md-delay="500">{{ $t("keyboard.ctrl") }}+O</md-tooltip>
    </span>
    <span
      @click="showSaveDialog = true"
      v-shortkey.once="['ctrl', 's']"
      @shortkey="showSaveDialog = true"
    >
      <md-icon>save</md-icon>{{ $t("menubar.save")
      }}<md-tooltip md-delay="500">{{ $t("keyboard.ctrl") }}+S</md-tooltip>
    </span>
    <span
      @click="showHelpDialog = true"
      v-shortkey.once="['f1']"
      @shortkey="showHelpDialog = true"
    >
      <md-icon>help</md-icon>{{ $t("menubar.help")
      }}<md-tooltip md-delay="500">F1</md-tooltip>
    </span>
    <span @click="showSettingsDialog = true">
      <md-icon>settings</md-icon>{{ $t("menubar.settings") }}
    </span>
    <div class="spacer"></div>
    <LanguageSwitcher></LanguageSwitcher>

    <md-menu md-direction="bottom-end">
      <md-button md-menu-trigger>
        <md-icon>menu</md-icon> {{ $t("menubar.more") }}</md-button
      >

      <md-menu-content class="menubar-content">
        <md-menu-item @click="showOpenJsonDialog = true"
          ><md-icon>file_upload</md-icon
          >{{ $t("menubar.importJson") }}</md-menu-item
        >
        <md-menu-item @click="showSaveJsonDialog = true"
          ><md-icon>file_download</md-icon
          >{{ $t("menubar.exportJson") }}</md-menu-item
        >
        <md-menu-item @click="openGithub()"
          ><md-icon>code</md-icon>{{ $t("menubar.github") }}</md-menu-item
        >
        <md-menu-item @click="showLicensesDialog = true"
          ><md-icon>view_headline</md-icon
          >{{ $t("menubar.openSource") }}</md-menu-item
        >
        <md-menu-item @click="showAboutDialog = true"
          ><md-icon>info_outline</md-icon
          >{{ $t("menubar.about") }}</md-menu-item
        >
      </md-menu-content>
    </md-menu>

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
      <md-dialog-title>{{ $t("dialog.help.title") }}</md-dialog-title>
      <md-dialog-content>
        <b>{{ $t("dialog.help.controlsTitle") }}</b>
        <p class="helpControls">{{ $t("dialog.help.controlsText") }}</p>
        <p>
          {{ $t("dialog.help.changeJsonWarning") }}
        </p>
        <br />
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showSettingsDialog">
      <md-dialog-title>{{ $t("dialog.settings.title") }}</md-dialog-title>
      <md-dialog-content>
        <Settings></Settings>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showSettingsDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showLicensesDialog">
      <md-dialog-title>{{ $t("dialog.openSource.title") }}</md-dialog-title>
      <md-dialog-content>
        <LicensesDialog></LicensesDialog>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showLicensesDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showAboutDialog">
      <md-dialog-title>{{ $t("dialog.about.title") }}</md-dialog-title>
      <md-dialog-content>
        <p>{{ $t("dialog.about.row1") }}</p>
        <p>
          <i18n path="dialog.about.row2">
            <a href="https://github.com/bitowl/ficsit-felix" place="github"
              >GitHub</a
            >
          </i18n>
        </p>
        <p>
          <i18n path="dialog.about.row3">
            <a
              href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS"
              place="authors"
              >{{ $t("dialog.about.authors") }}</a
            >
          </i18n>
        </p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showAboutDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>


    <div class="railroadWarning" v-if="railroadWarning">
      <p>
      This savefile is missing the train extra in the RailroadSubsystem. This might be due to a bug in the experimental version. Click the save button to download a repaired savefile.
      </p>
      <md-button
style="color: #44444480"
        class="md-flat md-accent"
        @click="railroadWarning = false"
        >{{ $t("general.cancel") }}</md-button>
    <md-button
style="color: #444"
        class="md-flat md-accent"
        @click="showSaveDialog = true"
        >{{ $t("menubar.save") }}</md-button>
      
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import LicensesDialog from "@/components/LicensesDialog";
import Settings from "@/components/Settings";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {findActorByName} from "@/helpers/entityHelper"

export default {
  name: "Menubar",
  components: {
    Logo,
    LicensesDialog,
    Settings,
    LanguageSwitcher
  },
  data: function() {
    return {
      logoAnimating: false,
      showHelpDialog: false,
      showOpenDialog: false,
      showSaveDialog: false,
      showOpenJsonDialog: false,
      showSaveJsonDialog: false,
      showSettingsDialog: false,
      showLicensesDialog: false,
      showAboutDialog: false,
      railroadWarning: true
    };
  },
  methods: {
    open() {
      this.$router.push("open/sav");
    },
    openJson() {
      this.$router.push("open/json");
    },
    save() {
      this.$router.push("save/sav");
    },
    saveJson() {
      this.$router.push("save/json");
    },
    openGithub() {
      window.open("https://github.com/bitowl/ficsit-felix", "_blank");
    }
  },
  mounted() {
          
      // Show warning for experimental save games
      this.railroadWarning = false;
      const railroadSubsystem = findActorByName("Persistent_Level:PersistentLevel.RailroadSubsystem");
      if (railroadSubsystem !== undefined) {
        if (railroadSubsystem.entity.extra === undefined) {
          this.railroadWarning = true;
          // reset to old save header version
          window.data.saveHeaderType = 5; 
        }
      }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";
.menubar {
  display: flex;
  background: $toolbarGray;
  flex-shrink: 0;
  padding-left: 30px;
  padding-right: 30px;
  user-select: none;
  .logoContainer {
    margin-right: 60px;
  }

  .spacer {
    flex-grow: 1;
  }
  span {
    display: inline-block;
    padding: 10px 10px;
    padding-right: 20px;
    font-size: 16px;
    line-height: 33px;
    i {
      padding-right: 12px;
    }
    color: #e3d3d3;
    transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  span:hover {
    color: $primaryOrange;
    cursor: pointer;
    .md-icon.md-theme-default.md-icon-font {
      color: $primaryOrange;
    }
  }
}
p,
b {
  padding: 0px 16px;
}


.railroadWarning {
  background: #f3e13d;
  color: #333;
  border-radius: 5px;
  padding: 10px;
  width: 50%;
  left: 25%;
  position: absolute;
  top: 10%;
  font-size: 16px;
  z-index: 6;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

<style lang="scss">
.menubar {
  .md-menu > .md-button {
    margin: 8px;
    text-transform: none;
    font-size: 16px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    color: #e3d3d3;
  }
}
.menubar-content {
  .md-list-item-content {
    justify-content: left !important;
  }
  .md-list-item-content > .md-icon:last-child {
    margin-left: 0px;
  }
  .md-list-item-content > .md-icon:first-child {
    margin-right: 12px;
  }
}

.md-dialog-content .helpControls {
  white-space: pre-line;
}
</style>
