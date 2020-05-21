<template>
  <div class="open">
    <CenterWhiteBox>
      <Logo :height="128" black="#fff" :animating="logoAnimating" />
      <h1>{{ $t('openPage.title') }}</h1>
      <OpenBox @startAnimating="logoAnimating = true" @stopAnimating="logoAnimating = false" />
      <div style="display: flex; flex-direction: row;">
        <v-btn @click="$router.push({ name: 'landingpage' })">
          {{
          $t('openPage.backButton')
          }}
        </v-btn>
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
import Vue from 'vue';
import Component from 'vue-class-component';

import Logo from '../core/Logo.vue';
import OpenBox from './OpenBox.vue';
import CenterWhiteBox from '../core/CenterWhiteBox.vue';
import Settings from '../core/Settings.vue';
import { EventBus } from '../../event-bus';
import { DIALOG_SETTINGS } from '../../ts/constants';

@Component({
  components: {
    Logo,
    OpenBox,
    CenterWhiteBox
  }
})
export default class Open extends Vue {
  logoAnimating: boolean = false;
  showSettingsDialog() {
    EventBus.$emit(DIALOG_SETTINGS);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.open {
  background: $surface url('/pipes_blurry.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
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
