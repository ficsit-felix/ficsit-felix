<template>
  <div class="menubar">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="logoContainer"
    >
      <Logo :height="48" black="#707070" :animating="logoAnimating"></Logo>
    </div>
    <span @click="showOpenDialog = true" v-shortkey.once="['ctrl', 'o']" @shortkey="showOpenDialog = true">
      <md-icon>folder_open</md-icon>Open<md-tooltip md-delay="500">Ctrl+O</md-tooltip>
    </span>
    <span @click="showSaveDialog = true" v-shortkey.once="['ctrl', 's']" @shortkey="showSaveDialog = true">
      <md-icon>save</md-icon>Save<md-tooltip md-delay="500">Ctrl+S</md-tooltip>
    </span>
    <span @click="showHelpDialog = true" v-shortkey.once="['f1']" @shortkey="showHelpDialog = true">
      <md-icon>help</md-icon>Help<md-tooltip md-delay="500">F1</md-tooltip>
    </span>
    <!--<span @click="showSettingsDialog = true">
      <md-icon>settings</md-icon>Settings
    </span>-->
    <div class="spacer"></div>
    <md-menu md-direction="bottom-end">
      <md-button md-menu-trigger>
      <md-icon>menu</md-icon> More
      </md-button>

      <md-menu-content class="menubar-content">
        <md-menu-item @click="showOpenJsonDialog = true"><md-icon>file_upload</md-icon>Import JSON</md-menu-item>
        <md-menu-item @click="showSaveJsonDialog = true"><md-icon>file_download</md-icon>Export JSON</md-menu-item>
        <md-menu-item @click="openGithub()"><md-icon>code</md-icon>GitHub</md-menu-item>
        <md-menu-item @click="showLicensesDialog = true"><md-icon>view_headline</md-icon>Open Source Licenses</md-menu-item>
        <md-menu-item @click="showAboutDialog = true"><md-icon>info_outline</md-icon>About</md-icon></md-menu-item>
      </md-menu-content>
    </md-menu>

    
    <!--<div class="spacer"></div>
    <span @click="showOpenJsonDialog = true">
      <md-icon>file_upload</md-icon>Import JSON
    </span>
    <span @click="showSaveJsonDialog = true">
      <md-icon>file_download</md-icon>Export JSON
    </span>
    <div class="spacer"></div>
    <span @click="openGithub()">GitHub</span>-->
    <md-dialog-confirm
      :md-active.sync="showOpenDialog"
      md-title="Open save file"
      md-content="Do you really want to open a new save file and lose any changes in the current one?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showOpenDialog = false"
      @md-confirm="open"
    />

    <md-dialog-confirm
      :md-active.sync="showSaveDialog"
      md-title="Save save file"
      md-content="Do you want to download this save as a .sav file?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showSaveDialog = false"
      @md-confirm="save"
    />

    <md-dialog-confirm
      :md-active.sync="showOpenJsonDialog"
      md-title="Import JSON file"
      md-content="Do you really want to import a JSON file and lose any changes in the current one?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showOpenJsonDialog = false"
      @md-confirm="openJson"
    />

    <md-dialog-confirm
      :md-active.sync="showSaveJsonDialog"
      md-title="Export JSON file"
      md-content="Do you want to export this save as a JSON file?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showSaveJsonDialog = false"
      @md-confirm="saveJson"
    />

  <md-dialog :md-active.sync="showHelpDialog">
      <md-dialog-title>Help</md-dialog-title>
      <md-dialog-content>
      <b>Controls</b>
      <p>
        Middle mouse pressed: move
        <br>Right mouse: rotate
        <br>Scroll wheel: zoom
        <br>Left mouse: select objects
      </p>
      <p>
        If you change the JSON you need to save it before clicking
        <br>anywhere in the scene, else it will be overwritten!
      </p>
      <br>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showSettingsDialog">
      <md-dialog-title>Settings</md-dialog-title>
      <md-dialog-content>
        <Settings></Settings>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showSettingsDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showLicensesDialog">
      <md-dialog-title>Open Source Licenses</md-dialog-title>
      <md-dialog-content>
        <LicensesDialog></LicensesDialog>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showLicensesDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showAboutDialog">
      <md-dialog-title>About</md-dialog-title>
      <md-dialog-content>
        <p>FeliX is a save file visualizer for the game Satisfactory.</p>
        <p>You can view the source code and contribute to the development on <a href="https://github.com/bitowl/ficsit-felix">GitHub</a>.</p>
              <p>
        The low-poly models used by FeliX were created by the respective
        <a
          href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS"
        >authors</a>.
      </p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showAboutDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

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
  .md-list-item-content>.md-icon:last-child {
    margin-left: 0px;
  }
  .md-list-item-content>.md-icon:first-child {
    margin-right: 12px;
  }


}
</style>


<script>
import Logo from "@/components/Logo";
import LicensesDialog from "@/components/LicensesDialog";
import Settings from "@/components/Settings";

export default {
  name: "Menubar",
  components: {
    Logo,
    LicensesDialog,
    Settings
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
      showAboutDialog: false
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
  }
};
</script>
