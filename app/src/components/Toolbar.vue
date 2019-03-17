<template>
  <div class="toolbar">
    <Logo :height="48"></Logo>

    <md-icon>folder_open</md-icon>
    Open
    <md-icon>save</md-icon>
    Save
    <md-icon class="md-size-2x">axis_arrow</md-icon>
    <md-icon class="md-size-2x">sync</md-icon>
    <md-icon class="md-size-2x">swap_horiz</md-icon>
    <div class="spacer"></div>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";
.toolbar {
  display: flex;
  background: $toolbarGray;
  flex-shrink: 0;
  padding-left: 20px;
  padding-right: 20px;
}
.spacer {
  flex-grow: 1;
}
</style>

<script>
import Logo from "@/components/Logo";
export default {
  components: {
    Logo
  }
};
</script>
