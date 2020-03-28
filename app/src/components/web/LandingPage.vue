<template>
  <div class="landingpage">
    <v-app>
      <v-app-bar app>
        <v-btn @click="downloadDesktop">Normal</v-btn>
      </v-app-bar>

      <v-btn small color="primary black--text">Primary</v-btn>
      <v-btn small color="secondary black--text">secondary</v-btn>
      <v-btn small color="error">error</v-btn>
<v-content style="width:100px;">
        <v-card>
          <v-card-title class="headline" primary-title>
            Privacy Policy
          </v-card-title>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-content>
    </v-app>
    <div class="languageSelection">
      {{ $t('landingPage.language') }}:
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <CenterWhiteBox>
      <div
        @mouseover="logoAnimating = true"
        @mouseleave="logoAnimating = false"
      >
        <Logo :height="180" black="#000" :animating="logoAnimating" />
      </div>
      <p>{{ $t('landingPage.firstParagraph') }}</p>
      <p class="buttonRow">
        <!--<md-button
          class="md-raised md-primary md-dense"
          @click="downloadDesktop()"
          >{{ $t('landingPage.downloadDesktop') }}</md-button
        >&nbsp;-->
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
