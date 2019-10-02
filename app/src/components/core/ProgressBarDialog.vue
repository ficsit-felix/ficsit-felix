<template>
  <div class="progress-bar-view">
    <div class="title">{{ progressText.title }}</div>
    <ProgressBar :progress="progress"></ProgressBar>
    <div class="currentStep">{{ progressText.currentStep }}</div>
    <md-button
      v-if="progressText.showCloseButton"
      @click="hideProgressDialog()"
    >
      {{ $t('general.close') }}
    </md-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import ProgressBar from './ProgressBar.vue';
import { EventBus } from '../../event-bus';
import { cursorTo } from 'readline';
import { DIALOG_PROGRESS } from '../../ts/constants';

@Component({
  components: {
    ProgressBar
  },
  computed: {
    ...mapState(['progress', 'progressText'])
  }
})
export default class ProgressBarDialog extends Vue {
  hideProgressDialog() {
    EventBus.$emit(DIALOG_PROGRESS, false);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.progress-bar-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.title {
  font-size: 30px;
  line-height: 1;
  margin-bottom: 50px;
  margin-top: 30px;
}

.currentStep {
  margin-top: 20px;
  margin-bottom: 30px;
  color: #ccc;
  font-size: 20px;
  line-height: 1;
}
</style>
