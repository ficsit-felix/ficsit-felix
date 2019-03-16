<template>
  <div class="toolbar">
    <Logo :height="64"></Logo>toolbar
    <div class="spacer"></div>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";
.toolbar {
  display: flex;
  background: $toolbarGray;
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
