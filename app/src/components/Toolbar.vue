<template>
  <div class="toolbar">
    <div @mouseover="logoAnimating = true" @mouseleave="logoAnimating = false">
      <Logo :height="48" black="#707070" :animating="logoAnimating"></Logo>
    </div>

    <ul>
      <li @click="showOpenDialog = true"><md-icon>folder_open</md-icon>Open<md-tooltip md-delay="500">Ctrl+O</md-tooltip></li>
      <li @click="showSaveDialog = true"><md-icon>save</md-icon>Save<md-tooltip md-delay="500">Ctrl+S</md-tooltip></li>
      <li @click="showHelpDialog = true"><md-icon>help</md-icon>Help<md-tooltip md-delay="500">F1</md-tooltip></li>
      <li></li>
      <li></li>
      <li></li>
      <li @click="showOpenJsonDialog = true">
        <md-icon>file_upload</md-icon>Import JSON
      </li>
      <li @click="showSaveJsonDialog = true">
        <md-icon>file_download</md-icon>Export JSON
      </li>
    </ul>

    <div class="spacer"></div>
    <li @click="openGithub()">GitHub</li>
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
      <b> Controls</b>
      <p>
        Middle mouse pressed: move<br />
        Right mouse: rotate<br />
        Scroll wheel: zoom<br />
        Left mouse: select objects
      </p>
      <p>
        If you change the JSON you need to save it before clicking
        <br />anywhere in the scene, else it will be overwritten!
      </p>
      <br />
      <b>Attribution</b>
      <p>
        The low-poly models used by FeliX were created by the respective <a href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS">authors</a>.
      </p>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false"
          >Close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <!--    <md-icon class="md-size-2x">axis_arrow</md-icon>
    <md-icon class="md-size-2x">sync</md-icon>
    <md-icon class="md-size-2x">swap_horiz</md-icon>-->
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/colors.scss";
.toolbar {
  display: flex;
  background: $toolbarGray;
  flex-shrink: 0;
  padding-left: 30px;
  padding-right: 30px;
  user-select: none;
  .spacer {
    flex-grow: 1;
  }
  ul {
    margin: 0px;
    margin-left: 30px;
  }
  li {
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
  li:hover {
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

<script>
import Logo from "@/components/Logo";
export default {
  name: "Toolbar",
  components: {
    Logo
  },
  data: function() {
    return {
      logoAnimating: false,
      showHelpDialog: false,
      showOpenDialog: false,
      showSaveDialog: false,
      showOpenJsonDialog: false,
      showSaveJsonDialog: false
    };
  },
  methods: {
    open() {
      this.$router.push("upload/sav");
    },
    openJson() {
      this.$router.push("upload/json");
    },
    save() {
      this.$router.push("download/sav");
    },
    saveJson() {
      this.$router.push("download/json");
    },
    openGithub() {
      window.location.href = "https://github.com/bitowl/ficsit-felix";
    }
  }
};
</script>
