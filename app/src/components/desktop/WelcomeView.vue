<template>
  <div class="landingpage">
    <DesktopMenu :visible="true"></DesktopMenu>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue } from 'vue-property-decorator';
import DesktopMenu from './DesktopMenu.vue';

@VueComponent({
  components: {
    DesktopMenu
  }
})
export default class MainScreen extends Vue {
  mounted() {
    // hide save menu entries
    this.$store.dispatch('setShowSaveMenuEntries', false);

    if (this.$store.state.settings.autoLoadSaveFile !== '') {
      this.$router.push({
        path: 'open/auto'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.landingpage {
  background: #49484b;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

</style>
