<template>
  <div class="upload">
    <div class="centered">
      <Logo height=180 black="#000" />
      <h1>Upload save file</h1>
      <UploadBox />
    </div>
  </div>
</template>
<style lang="scss">
  @import "@/assets/colors.scss";
  .upload {
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
import UploadBox from "@/components/UploadBox"

export default {
  name: "Upload",
  components: {
    Logo, UploadBox
  }
}
</script>

