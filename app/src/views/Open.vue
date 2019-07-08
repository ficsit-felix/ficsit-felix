<template>
  <div class="open">
    <div class="centered">
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Logo from '@/components/Logo.vue';
import OpenBox from '@/components/OpenBox.vue';

@Component({
  components: {
    Logo,
    OpenBox
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
.centered {
  margin: auto;
  width: 700px;
  background: $boxWhite;
  border-radius: 10px;
  text-align: center;
  position: relative;
}
</style>
