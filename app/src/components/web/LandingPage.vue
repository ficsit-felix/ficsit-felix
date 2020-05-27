<template>
  <div class="landingpage">
    <div class="languageSelection">
      {{ $t('landingPage.language') }}:
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <CenterWhiteBox>
      <div @mouseover="logoAnimating = true" @mouseleave="logoAnimating = false">
        <Logo :height="128" black="#fff" :animating="logoAnimating" />
      </div>
      <p class="my-2 mx-4">{{ $t('landingPage.firstParagraph') }}</p>
      <p class="buttonRow">
        <v-btn
          color="primary black--text"
          @click="$router.push({ path: '/open/sav' })"
          class="ma-2"
        >{{ $t('landingPage.openSavButton') }}</v-btn>&nbsp;
        <v-btn
          color="secondary black--text"
          @click="downloadDesktop()"
          class="ma-2"
        >{{ $t('landingPage.downloadDesktop') }}</v-btn>
      </p>
      <a href="/screenshot.png">
        <img src="/screenshot.png" />
      </a>
      <p class="my-2 mx-4">{{ $t('landingPage.secondParagraph') }}</p>
      <v-btn
        @click="$router.push({ path: '/open/json' })"
        class="ma-2"
        outlined
      >{{ $t('landingPage.openJsonButton') }}</v-btn>

      <p class="left my-4">
        <i18n path="landingPage.thirdParagraph">
          <a href="https://github.com/ficsit-felix/ficsit-felix" slot="github">GitHub</a>
          <a
            href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
            slot="authors"
          >{{ $t('landingPage.authors') }}</a>
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
  background: $surface url('/pipes_blurry.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.landingpage {
  overflow: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
  position: relative;
}

.left {
  text-align: left;
}

.commithash {
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  font-size: 12px;
  text-align: right;
  padding-right: 16px;
  padding-bottom: 16px;
}

.languageSelection {
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 800px) {
  .languageSelection {
    position: inherit;
    justify-content: flex-end;
  }
}

.buttonRow {
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    display: block;
  }
}
</style>
