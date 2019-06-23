<template>
  <div class="open">
    <div class="centered">
      <Logo height="180" black="#000" :animating="logoAnimating" />
      <h1>{{ $t("experimentalFix.title") }}</h1>
      <div
        style="color: #333;padding: 1px 16px 0px 16px; text-align: left;font-size: 16px;"
      >
        <p>{{ $t("experimentalFix.explanation") }}</p>
        <p>{{ $t("experimentalFix.explanation2") }}</p>
        <p>{{ $t("experimentalFix.explanation3") }}</p>
      </div>
      <ExperimentalFixBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
      <p>
        <i18n path="experimentalFix.errorText">
          <a
            href="https://www.dropbox.com/request/Db1OgmSDra2EEVjPbcmj"
            place="dropbox"
            >{{ $t("openPage.dropboxText") }}</a
          >
          <a href="mailto:felix@owl.yt" place="mail">felix@owl.yt</a>
        </i18n>
      </p>
      <p>
        <md-button
          class="md-raised"
          @click="$router.push({ name: 'landingpage' })"
        >
          {{ $t("savePage.backButton") }}
        </md-button>
      </p>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import ExperimentalFixBox from "@/components/ExperimentalFixBox";

export default {
  name: "ExperimentalFix",
  components: {
    Logo,
    ExperimentalFixBox
  },
  data: function() {
    return {
      logoAnimating: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";
.open {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.centered {
  width: 700px;
  background: $boxWhite;
  border-radius: 10px;
  text-align: center;
  position: relative;
}
</style>
