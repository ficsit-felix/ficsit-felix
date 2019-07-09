<template>
  <div class="centerBox">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class CenterWhiteBox extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.centerBox {
  margin: auto; // fix scrolling in vertically centered flex box, see https://stackoverflow.com/a/33455342
  width: 700px;
  background: $boxWhite;
  border-radius: 10px;
  text-align: center;
  position: relative;
  @media (max-width: 700px) {
    width: 100%;
    border-radius: 0px;
  }
}
</style>

