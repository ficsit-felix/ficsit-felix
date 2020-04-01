<template>
  <div class="open">
    <CenterWhiteBox>
      <Logo :height="128" black="#fff" :animating="logoAnimating" />
      <h1>{{ $t('openPage.title') }}</h1>
      <OpenBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
      <div style="display: flex; flex-direction: row;">
        <v-btn @click="$router.push({ name: 'landingpage' })">
          {{ $t('openPage.backButton') }}
        </v-btn>
        <div class="spacer"></div>
        <v-btn class="md-raised" @click="showSettingsDialog = true">
          <v-icon left>mdi-cog</v-icon>
          {{ $t('menubar.settings') }}
        </v-btn>
      </div>
    </CenterWhiteBox>

    <v-dialog v-model="showSettingsDialog" width="700" scrollable>
      <v-card>
        <v-card-title>
          {{ $t('dialog.settings.title') }}
        </v-card-title>

        <v-card-text>
          <Settings></Settings>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSettingsDialog = false">{{
            $t('general.close')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Logo from './Logo.vue';
import OpenBox from './OpenBox.vue';
import CenterWhiteBox from './CenterWhiteBox.vue';
import Settings from './Settings.vue';

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
