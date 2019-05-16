<template>
  <div class="landingpage">
    <div class="centered">
      <div @mouseover="logoAnimating = true" @mouseleave="logoAnimating = false">
        <Logo height="180" black="#000" :animating="logoAnimating" />
      </div>
      <p>
        FeliX is a save file visualizer for the game Satisfactory. When you upload your .sav file here, you can view a low poly 3D representation of your factory and the surrounding area.
      </p>
      <md-button class="md-raised" @click="$router.push({ path: '/upload/sav'})">
        Upload .sav file
      </md-button>
      <p>
        <a href="/screenshot.png"><img src="/screenshot.png" /></a>
      </p>
      <p>
        FeliX also has some basic editing capabilities. It can convert the .sav format to a human-readable .json format. You can edit the .json file externally and then upload it again to convert it back to a .sav file:
      </p>
      <md-button class="md-flat md-accent" @click="$router.push({ path: '/upload/json'})">
        Upload .json file
      </md-button>

      <p class="left">
        The source code for this application is available on <a href="https://github.com/bitowl/ficsit-felix">GitHub</a>.
        We are happy about any contributions.
        The low poly models were created by the respective <a href="https://github.com/bitowl/ficsit-felix/blob/master/app/public/models/AUTHORS">authors</a>.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.landingpage {
  overflow: auto;
  display: flex;
  height: 100%;
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
}
.left {
    text-align: left;
  }  
</style>

<script>
import Logo from "@/components/Logo";
import * as Sentry from "@sentry/browser";

export default {
  name: "LandingPage",
  components: {
    Logo
  },
  data: function() {
    return {
      logoAnimating: false
    };
  },
  mounted() {
    Sentry.captureMessage("visit landing page");
  }
};
</script>
