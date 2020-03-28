<template>
  <div class="landingpage">
    <div class="languageSelection">
      {{ $t('landingPage.language') }}:
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <CenterWhiteBox>
      <div
        @mouseover="logoAnimating = true"
        @mouseleave="logoAnimating = false"
      >
        <Logo :height="128" black="#fff" :animating="logoAnimating" />
      </div>
      <p>{{ $t('landingPage.firstParagraph') }}</p>
      <p class="buttonRow">
        <v-btn
          color="primary black--text"
          @click="$router.push({ path: '/open/sav' })"
          >{{ $t('landingPage.openSavButton') }}</v-btn
        >
        &nbsp;
        <v-btn color="secondary black--text" @click="downloadDesktop()">{{
          $t('landingPage.downloadDesktop')
        }}</v-btn>
      </p>
      <a href="/screenshot.png">
        <img src="/screenshot.png" />
      </a>
      <p>{{ $t('landingPage.secondParagraph') }}</p>
      <v-btn @click="$router.push({ path: '/open/json' })">{{
        $t('landingPage.openJsonButton')
      }}</v-btn>

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
  mounted() {},
  methods: {
    downloadDesktop() {
      location.href =
        'https://github.com/ficsit-felix/ficsit-felix/releases/latest';
    }
  }
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

.buttonRow {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
