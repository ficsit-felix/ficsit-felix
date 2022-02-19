<template>
  <div class="open">
    <CenterWhiteBox>
      <Logo :height="128" black="#fff" :animating="logoAnimating" />
      <h1>{{ $t('openPage.title') }}</h1>
      <OpenBox
        @start-animating="logoAnimating = true"
        @stop-animating="logoAnimating = false"
      />
      <div style="display: flex; flex-direction: row">
        <v-btn @click="$router.push({ name: 'landingpage' })">{{
          $t('openPage.backButton')
        }}</v-btn>
        <div class="spacer"></div>
        <v-btn @click="showSettingsDialog()">
          <v-icon left>mdi-cog</v-icon>
          {{ $t('menubar.settings') }}
        </v-btn>
      </div>
    </CenterWhiteBox>
  </div>
</template>

<script lang="ts">
import { DIALOG_SETTINGS } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { Component as VueComponent, Vue } from 'vue-property-decorator';
import CenterWhiteBox from '../core/CenterWhiteBox.vue';
import Logo from '../core/Logo.vue';
import OpenBox from './OpenBox.vue';

@VueComponent({
  components: {
    Logo,
    OpenBox,
    CenterWhiteBox,
  },
})
export default class OpenView extends Vue {
  logoAnimating: boolean = false;
  showSettingsDialog() {
    EventBus.$emit(DIALOG_SETTINGS);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.open {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.spacer {
  flex-grow: 1;
}
</style>
