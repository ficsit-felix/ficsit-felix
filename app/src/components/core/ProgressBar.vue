<template>
  <div class="progressbar">
    <div class="content" v-bind:style="{ width: progress + '%' }"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
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
  background: #ffffff80;
  max-width: 1000px;
  .content {
    background: $middleGray;
    height: 100%;
    border-radius: 3px;
  }
}
</style>
