<template>
  <div class="toolbar">
    <Logo :height="48"></Logo>
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
