<template>
  <div class="open">
    <CenterWhiteBox>
      <Logo :height="180" black="#000" :animating="logoAnimating" />
      <h1>{{ $t('openPage.title') }}</h1>
      <OpenBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
      <div style="display: flex; flex-direction: row;">
        <md-button
          class="md-raised"
          @click="$router.push({ name: 'landingpage' })"
        >
          {{ $t('openPage.backButton') }}
        </md-button>
        <div class="spacer"></div>
        <md-button class="md-raised" @click="showSettingsDialog = true">
          <md-icon>settings</md-icon>
          {{ $t('menubar.settings') }}
        </md-button>
      </div>
    </CenterWhiteBox>

    <md-dialog :md-active.sync="showSettingsDialog">
      <md-dialog-title>{{ $t('dialog.settings.title') }}</md-dialog-title>
      <md-dialog-content>
        <Settings></Settings>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showSettingsDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Logo from '@/components/Logo.vue';
import OpenBox from '@/components/OpenBox.vue';
import CenterWhiteBox from '@/components/CenterWhiteBox.vue';
import Settings from '@/components/Settings.vue';

@Component({
  components: {
    Logo,
    OpenBox,
    CenterWhiteBox,
    Settings
  }
})
export default class Open extends Vue {
  logoAnimating: boolean = false;
  showSettingsDialog: boolean = false;
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
