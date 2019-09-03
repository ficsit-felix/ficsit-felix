<template>
  <div class="progress-bar-view">
    <div class="title">Loading files</div>
    <ProgressBar :progress="progress"></ProgressBar>
    <div class="currentStep">reading the file...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import ProgressBar from './ProgressBar.vue';

@Component({
  components: {
    ProgressBar
  },
  computed: {
    ...mapState(['progress'])
  }
})
export default class ProgressBarView extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.progress-bar-view {
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.title {
  font-size: 40px;
  line-height: 2;
  margin-bottom: 40px;
}

.currentStep {
  margin-top: 50px;
  color: $middleGray;
  font-size: 20px;
}
</style>
