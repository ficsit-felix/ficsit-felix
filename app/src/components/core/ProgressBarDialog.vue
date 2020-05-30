<template>
  <v-card class="progress-bar-view">
    <v-card-title>
      {{ progressText.title }}
      <v-spacer></v-spacer>
      <div class="spinner" v-if="!progressText.showCloseButton"></div>
    </v-card-title>
    <v-card-text>
      <v-progress-linear :value="progress" height="50" rounded>
        <strong style="text-shadow: 1px 1px 2px #000000ff"
          >{{ Math.round(progress) }} %</strong
        >
      </v-progress-linear>

      <div class="mt-2">{{ progressText.currentStep }}</div>
    </v-card-text>
    <v-card-actions v-if="progressText.showCloseButton">
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="hideProgressDialog()">
        {{ $t('general.close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
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
    // ProgressBar
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
  /*display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;*/
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

::v-deep .v-progress-linear__determinate {
  transition: none; // Because the render thread will be hanging most of the time, transitions will not look good
}

.spinner {
  border: 4px solid transparent;
  border-top: 4px solid $primaryOrange;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1.5s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
