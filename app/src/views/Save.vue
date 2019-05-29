<template>
  <div class="save">
    <div class="centered">
      <Logo height="180" black="#000" :animating="logoAnimating" />
      <h1>Download save file</h1>
      <SaveBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/colors.scss";
.save {
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
import SaveBox from "@/components/SaveBox";

export default {
  name: "Save",
  components: {
    Logo,
    SaveBox
  },
  data: function() {
    return {
      logoAnimating: true
    };
  }
};
</script>
