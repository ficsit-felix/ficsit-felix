<template>
  <div class="open">
    <div class="centered">
      <Logo height="180" black="#000" :animating="logoAnimating" />
      <h1>{{ $t("experimentalFix.title") }}</h1>
      <div class="experimentalFix">
        <p>{{ $t("experimentalFix.landingText") }}</p>
      </div>

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
          {{ $t("openPage.backButton") }}
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
  overflow: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.centered {
  margin: auto;
  width: 700px;
  @media (max-width: 700px) {
    width: 100%;
  }
  background: $boxWhite;
  border-radius: 10px;
  text-align: center;
  position: relative;
}

.experimentalFix {
  display: flex;
  flex-direction: row;
  background: #48ff0060;
  align-items: center;
  @media (max-width: 500px) {
    flex-direction: column;
  }
  color: $textGray;
}
</style>
