<template>
  <div class="open">
    <CenterWhiteBox>
      <Logo :height="180" black="#000" :animating="logoAnimating" />
      <h1>{{ $t('openPage.title') }}</h1>
      <OpenBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
      <p>
        <md-button
          class="md-raised"
          @click="$router.push({ name: 'landingpage' })"
        >
          {{ $t('openPage.backButton') }}
        </md-button>
      </p>
    </CenterWhiteBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Logo from '@/components/Logo.vue';
import OpenBox from '@/components/OpenBox.vue';
import CenterWhiteBox from '@/components/CenterWhiteBox.vue';

@Component({
  components: {
    Logo,
    OpenBox,
    CenterWhiteBox
  }
})
export default class Open extends Vue {
  logoAnimating: boolean = false;
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
</style>
