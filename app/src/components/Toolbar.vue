<template>
  <div class="toolbar">
    <div
    @mouseover="logoAnimating=true"
    @mouseleave="logoAnimating=false">
    <Logo :height="48" black="#707070" :animating="logoAnimating"></Logo>
    </div>

    <ul>
      <li @click="showOpenDialog=true">
        <md-icon>folder_open</md-icon>Open
      </li>
      <li @click="showSaveDialog=true">
        <md-icon>save</md-icon>Save
      </li>
      <li @click="showHelpDialog=true">
        <md-icon>help</md-icon>Help
      </li>
    </ul>

    <md-dialog-confirm
      :md-active.sync="showOpenDialog"
      md-title="Open save file"
      md-content="Do you really want to open a new save file and lose any changes in the current one?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showOpenDialog=false"
      @md-confirm="open" />

    <md-dialog-confirm
      :md-active.sync="showSaveDialog"
      md-title="Save save file"
      md-content="Do you want to download this save as a .sav file?"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="showSaveDialog=false"
      @md-confirm="save" />

    <md-dialog :md-active.sync="showHelpDialog">
      <md-dialog-title>Help</md-dialog-title>
      <b> Controls</b>
      <p>
        
        Middle mouse pressed: move<br />
        Right mouse: rotate<br />
        Scroll wheel: zoom<br />
        Left mouse: select objects
        </p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showHelpDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <!--    <md-icon class="md-size-2x">axis_arrow</md-icon>
    <md-icon class="md-size-2x">sync</md-icon>
    <md-icon class="md-size-2x">swap_horiz</md-icon>-->
    <div class="spacer"></div>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";
.toolbar {
  display: flex;
  background: $toolbarGray;
  flex-shrink: 0;
  padding-left: 30px;
  padding-right: 30px;

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
    line-height: 32px;
    i {
      padding-right: 12px;
    }
  }
  li:hover {
    color: $primaryOrange;
    cursor: pointer;
  }
}

  p,b {
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
      showSaveDialog: false
    };
  },
  methods: {
    open() {
      this.$router.push("upload");
    },
    save() {
      this.$router.push("download");
    }
  }
};
</script>
