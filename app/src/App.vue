<template>
  <div id="app">
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
  color: #adadad;
  height: 100%;
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
import "@/assets/main.scss";
import { mapState } from "vuex";

export default {
  name: "App",
  computed: mapState(["title"]),
  methods: {
    testError: function() {
      throw new Error("asdf");
    }
  }
};
</script>
