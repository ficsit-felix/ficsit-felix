<template>
  <div class="progressbar">
    <div class="content" v-bind:style="{ width: progress + '%' }"></div>
    <div class="label">{{ Math.round(progress) }}%</div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue, Prop } from 'vue-property-decorator';

@VueComponent({})
export default class ProgressBar extends Vue {
  @Prop({ default: 0 }) readonly progress!: number;
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.progressbar {
  width: 100%;
  border: 2px solid $middleGray;
  height: 50px;
  border-radius: 5px;
  padding: 3px;
  max-width: 1000px;
  background: #ffffff;
  position: relative;

  .content {
    background: $middleGray;
    height: 100%;
    border-radius: 3px;
  }
  .label {
    position: absolute;
    top: 0px;
    text-align: center;
    width: 100%;
    color: #fff;
    text-shadow: 1px 1px 1px #333, 0px 0px 2px #000;
    font-size: 22px;
    line-height: 45px;
  }
}
</style>
