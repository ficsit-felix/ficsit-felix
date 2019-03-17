<template>
  <div class="toolbar">
    <Logo :height="48"></Logo>

    <ul>
      <li>
        <md-icon>folder_open</md-icon>Open
      </li>
      <li>
        <md-icon>save</md-icon>Save
      </li>
      <li @click="showHelpDialog=true">
        <md-icon>help</md-icon>Help
      </li>
    </ul>

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
}
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
      showHelpDialog: true
    };
  }
};
</script>
