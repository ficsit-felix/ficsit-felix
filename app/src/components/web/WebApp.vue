<template>
  <div id="app">
    <v-app>
      <router-view />
      <Dialogs></Dialogs>
    </v-app>
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
  overflow: hidden;
}
#nav {
  position: absolute;
  right: 20px;
  padding: 30px;
  a {
    font-weight: bold;
    color: #83c1ff;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import '@/assets/main.scss';
import { mapState } from 'vuex';
import Dialogs from '../core/Dialogs.vue';

export default {
  name: 'App',
  components: {
    Dialogs
  },
  computed: mapState(['title']),
  methods: {
    testError: function() {
      throw new Error('asdf');
    }
  }
};
</script>
