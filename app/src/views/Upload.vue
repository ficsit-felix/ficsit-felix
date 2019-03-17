<template>
  <div class="upload">
    <div class="centered">
      <Logo height=180 black="#000"></Logo>
      
    </div>
  </div>
</template>
<style lang="scss">
  @import "@/assets/colors.scss";
  .centered {
    width: 700px;
    margin: auto;
    background: $boxWhite;
    border-radius: 10px;
    text-align: center;
    margin-top: 30px;
  }
</style>

<script>
import Logo from "@/components/Logo";

export default {
  name: "Upload",
  components: {
    Logo
  }
}
</script>

