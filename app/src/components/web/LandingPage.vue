<template>
  <div class="landingpage">
    <CenterWhiteBox>
      <div
        @mouseover="logoAnimating = true"
        @mouseleave="logoAnimating = false"
      >
        <Logo :height="180" black="#000" :animating="logoAnimating" />
      </div>
      <p>{{ $t('landingPage.firstParagraph') }}</p>
      <p>
        <md-button
          class="md-raised"
          @click="$router.push({ path: '/open/sav' })"
          >{{ $t('landingPage.openSavButton') }}</md-button
        >
      </p>
      <a href="/screenshot.png">
        <img src="/screenshot.png" />
      </a>
      <p>{{ $t('landingPage.secondParagraph') }}</p>
      <md-button
        class="md-flat md-accent"
        @click="$router.push({ path: '/open/json' })"
        >{{ $t('landingPage.openJsonButton') }}</md-button
      >

      <p class="left">
        <i18n path="landingPage.thirdParagraph">
          <a href="https://github.com/ficsit-felix/ficsit-felix" slot="github"
            >GitHub</a
          >
          <a
            href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
            slot="authors"
            >{{ $t('landingPage.authors') }}</a
          >
        </i18n>
      </p>
      <div class="languageSelection">
        {{ $t('landingPage.language') }}:
        <LanguageSwitcher></LanguageSwitcher>
      </div>
    </CenterWhiteBox>
    <div class="commithash">{{ commithash }}</div>
  </div>
</template>

<script>
import Logo from '@/components/core/Logo';
import * as Sentry from '@sentry/browser';
import { commithash } from '@/js/commithash';
import LanguageSwitcher from '@/components/core/LanguageSwitcher';
import { reportMessage } from '@/ts/errorReporting';
import CenterWhiteBox from '@/components/core/CenterWhiteBox';

export default {
  name: 'LandingPage',
  components: {
    Logo,
    LanguageSwitcher,
    CenterWhiteBox
  },
  data: function() {
    return {
      logoAnimating: false,
      commithash: commithash
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.landingpage {
  overflow: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
}

p {
  color: $textGray;
  padding: 0px 15px;
}
.left {
  text-align: left;
}

.commithash {
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
  font-size: 12px;
}

.languageSelection {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
