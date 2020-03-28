import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.orange.lighten3, // orange 200
        secondary: colors.cyan.lighten3, // cyan 200
        background: colors.cyan.base
      }
    }
  }
});
