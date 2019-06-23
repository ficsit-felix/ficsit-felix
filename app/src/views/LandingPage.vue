<template>
  <div class="landingpage">
    <div class="centered">
      <div
        @mouseover="logoAnimating = true"
        @mouseleave="logoAnimating = false"
      >
        <Logo height="180" black="#000" :animating="logoAnimating" />
      </div>
      <div
        style="display: flex; flex-direction: row;background: #ffff0060; align-items: center;"
      >
        <p>
          {{ $t("experimentalFix.landingText") }}
        </p>
        <md-button
          style="flex-shrink: 0"
          class="md-raised"
          @click="$router.push({ path: '/experimental-fix' })"
          >{{ $t("experimentalFix.landingButton") }}</md-button
        >
      </div>

      <p>{{ $t("landingPage.firstParagraph") }}</p>
      <p>
        <md-button
          class="md-raised"
          @click="$router.push({ path: '/open/sav' })"
          >{{ $t("landingPage.openSavButton") }}</md-button
        >
      </p>
      <a href="/screenshot.png">
        <img src="/screenshot.png" />
      </a>
      <p>
        {{ $t("landingPage.secondParagraph") }}
      </p>
      <md-button
        class="md-flat md-accent"
        @click="$router.push({ path: '/open/json' })"
        >{{ $t("landingPage.openJsonButton") }}</md-button
      >

      <p class="left">
        <i18n path="landingPage.thirdParagraph">
          <a href="https://github.com/bitowl/ficsit-felix" place="github"
            >GitHub</a
          >
          <a
            href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS"
            place="authors"
            >{{ $t("landingPage.authors") }}</a
          >
        </i18n>
      </p>
      <div class="languageSelection">
        {{ $t("landingPage.language") }}: <LanguageSwitcher></LanguageSwitcher>
      </div>
    </div>
    <div class="commithash">{{ commithash }}</div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import * as Sentry from "@sentry/browser";
import { commithash } from "@/js/commithash";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { reportMessage } from "@/ts/errorReporting";

export default {
  name: "LandingPage",
  components: {
    Logo,
    LanguageSwitcher
  },
  data: function() {
    return {
      logoAnimating: false,
      commithash: commithash
    };
  },
  mounted() {
    reportMessage("visit landing page");
    if (this.$store.state.settings.autoLoadSaveFile !== "") {
      this.$router.push({
        path: "open/auto"
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
@import "@/assets/colors.scss";

.landingpage {
  overflow: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
}

.centered {
  margin: auto; // fix scrolling in vertically centered flex box, see https://stackoverflow.com/a/33455342
  width: 700px;
  background: $boxWhite;
  border-radius: 10px;
  text-align: center;
  position: relative;
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
