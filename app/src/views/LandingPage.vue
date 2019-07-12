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
          <a href="https://github.com/bitowl/ficsit-felix" place="github"
            >GitHub</a
          >
          <a
            href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS"
            place="authors"
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
    <BugReportDialog
      :visible="true"
      message="This is a demo bug."
    ></BugReportDialog>
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import * as Sentry from '@sentry/browser';
import { commithash } from '@/js/commithash';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { reportMessage } from '@/ts/errorReporting';
import CenterWhiteBox from '@/components/CenterWhiteBox';
import BugReportDialog from '@/components/BugReportDialog';

export default {
  name: 'LandingPage',
  components: {
    Logo,
    LanguageSwitcher,
    CenterWhiteBox,
    BugReportDialog
  },
  data: function() {
    return {
      logoAnimating: false,
      commithash: commithash
    };
  },
  mounted() {
    if (this.$store.state.settings.autoLoadSaveFile !== '') {
      this.$router.push({
        path: 'open/auto'
      });
    }

    // Set persisted locale
    const lang = this.$store.state.settings.locale;
    import(`@/lang/${lang}.json`).then(msgs => {
      this.$i18n.setLocaleMessage(lang, msgs.default || msgs);
      this.$i18n.locale = lang;
    });
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
</style>
