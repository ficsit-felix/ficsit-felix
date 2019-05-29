<template>
  <div class="open">
    <div class="centered">
      <Logo height="180" black="#000" :animating="logoAnimating" />
      <h1>Open save file</h1>
      <OpenBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
    </div>
  </div>
</template>
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

<script>
import Logo from "@/components/Logo";
import OpenBox from "@/components/OpenBox";

export default {
  name: "Open",
  components: {
    Logo,
    OpenBox
  },
  data: function() {
    return {
      logoAnimating: false
    };
  }
};
</script>
