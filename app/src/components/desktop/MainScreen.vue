<template>
  <div class="landingpage">
    <div class="content">
      <p>{{ $t('landingPage.firstParagraph') }}</p>
      <p>
        <md-button
          class="md-raised"
          @click="$router.push({ path: '/open/sav' })"
          >{{ $t('landingPage.openSavButton') }}</md-button
        >
      </p>
      <img src="/screenshot.png" />
      <p>{{ $t('landingPage.secondParagraph') }}</p>
      <md-button
        class="md-flat md-accent"
        @click="$router.push({ path: '/open/json' })"
        >{{ $t('landingPage.openJsonButton') }}</md-button
      >

      <p class="left">
        <i18n path="landingPage.thirdParagraph">
          <a href="https://github.com/ficsit-felix/ficsit-felix" place="github"
            >GitHub</a
          >
          <a
            href="https://github.com/ficsit-felix/ficsit-felix/blob/master/app/public/models/AUTHORS"
            place="authors"
            >{{ $t('landingPage.authors') }}</a
          >
        </i18n>
      </p>
      <div class="languageSelection">
        {{ $t('landingPage.language') }}:
        <LanguageSwitcher></LanguageSwitcher>
      </div>
    </div>
  </div>
</template>

<script>
import * as Sentry from '@sentry/browser';
import { commithash } from '@/js/commithash';
import LanguageSwitcher from '@/components/core/LanguageSwitcher';
import { reportMessage } from '@/ts/errorReporting';
import CenterWhiteBox from '@/components/core/CenterWhiteBox';

export default {
  name: 'MainScreen',
  components: {
    LanguageSwitcher
  },
  data: function() {
    return {
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

    // read files
    const testFolder = '/';
    const fs = require('fs');

    fs.readdir(testFolder, (err, files) => {
      console.log(err);
      files.forEach(file => {
        console.log(file);
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.landingpage {
  height: 100%;
  overflow: auto;
}
.content {
  max-width: 800px;
  min-height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

p {
  color: $textLightGray;
  font-size: 16px;
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
