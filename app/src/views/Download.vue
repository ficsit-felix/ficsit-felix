<template>
  <div class="download">
    <div class="centered">
      <Logo height=180 black="#000" />
      <h1>Download save file</h1>
      <DownloadBox />
    </div>
  </div>
</template>
<style lang="scss">
  @import "@/assets/colors.scss";
  .download {
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
import DownloadBox from "@/components/DownloadBox"

export default {
  name: "Download",
  components: {
    Logo, DownloadBox
  }
}
</script>

