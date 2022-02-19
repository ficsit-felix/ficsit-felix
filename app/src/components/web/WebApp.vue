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
import { WebFileWriter } from '@/lib/web/WebFileWriter';
import { ON_SAVE_JSON_PRESSED, ON_SAVE_PRESSED } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { SaveGameSaving } from '@lib/SaveGameSaving';
import { mapState } from 'vuex';
import Dialogs from '../core/dialogs/Dialogs.vue';

export default {
  name: 'App',
  components: {
    Dialogs,
  },
  computed: mapState(['title']),
  mounted() {
    EventBus.$on(ON_SAVE_PRESSED, this.onSavePressed);
    EventBus.$on(ON_SAVE_JSON_PRESSED, this.onSaveJsonPressed);
  },
  beforeDestroy() {
    EventBus.$off(ON_SAVE_PRESSED, this.onSavePressed);
    EventBus.$off(ON_SAVE_JSON_PRESSED, this.onSaveJsonPressed);
  },
  methods: {
    onSavePressed() {
      new SaveGameSaving(this, new WebFileWriter()).saveSaveGame(
        window.data,
        this.$store.state.filename.replace('.json', '.sav'),
        false
      );
    },
    onSaveJsonPressed() {
      new SaveGameSaving(this, new WebFileWriter()).saveSaveGame(
        window.data,
        this.$store.state.filename.replace('.sav', '.json'),
        true
      );
    },
  },
};
</script>
