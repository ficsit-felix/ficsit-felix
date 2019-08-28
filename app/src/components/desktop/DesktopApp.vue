<template>
  <div id="app">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="titlebar-logo"
    >
      <Logo :height="25" black="#505050" :animating="logoAnimating"></Logo>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #adadad;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.titlebar-logo {
  display: inline-block;
  position: fixed;
  margin-top: -30px;
  left: 10px;
  z-index: 100000;
  -webkit-app-region: no-drag;
}
</style>

<script>
import '@/assets/main.scss';
import Logo from '../core/Logo.vue';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { Menu } from 'electron';
import Vue from 'vue';
export default {
  name: 'DesktopApp',
  components: {
    Logo
  },
  data: function() {
    return {
      logoAnimating: false
    };
  },
  mounted() {
    this.titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#16161d'),
      itemBackgroundColor: Color.fromHex('#26262d')
    });
    this.titlebar.updateTitle('FICSIT - FeliX');
  },
  beforeDestroy() {
    this.titlebar.dispose();
  }
};
</script>
