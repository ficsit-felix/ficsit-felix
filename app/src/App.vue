<template>
  <div id="app">
    {{title}}
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/upload">Upload</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #adadad;
}
#nav {
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
import {mapState} from 'vuex';

export default {
  name: 'App',
  computed: mapState([
    'title'
  ])
};
</script>
