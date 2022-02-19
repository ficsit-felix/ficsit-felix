import '@lib/cmdHelper';
import { CHANGE_LOCALE } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import Vue from 'vue';
import vgl from 'vue-golden-layout';
import Router from 'vue-router';
import './assets/golden-layout-dark.css';
import { i18n } from './plugins/i18n';
import vuetify from './plugins/vuetify';
import store from './store';

// vue-shortkey
Vue.use(require('vue-shortkey'));

// Vue-golden-layout
Vue.use(vgl);

Vue.config.productionTip = false;

const router: Router = require('./router/web').default;

// Redirect if data was not yet loaded
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresDataLoaded && !store.state.dataLoaded) {
    next({ name: 'landingpage' });
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  beforeCreate() {
    this.$store.commit('settings/INIT_STORE_FROM_LOCAL_DATA');
  },
  render: (h) => h(require('./components/web/WebApp.vue').default),
}).$mount('#app');

// Set persisted locale
const lang = store.state.settings.locale;
import(`@/assets/i18n/${lang}.json`).then((msgs) => {
  i18n.setLocaleMessage(lang, msgs.default || msgs);
  i18n.locale = lang;
  EventBus.$emit(CHANGE_LOCALE);
});
