import Vue from 'vue';
import WebApp from './components/web/WebApp.vue';
import DesktopApp from './components/desktop/DesktopApp.vue';

import store from './store';
import { commithash } from '@/js/commithash';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import { i18n } from './plugins/i18n';
import { isElectron } from './ts/isElectron';

import routerElectron from './router_electron';
import routerWeb from './router_web';

import '@/helpers/cmdHelper';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://4bee35ee7cba4ba194c9e1a575948656@sentry.io/1416938',
    release: commithash,
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  });
}

// vue-material
import {
  MdButton,
  MdField,
  MdSnackbar,
  MdDialog,
  MdDialogAlert,
  MdDialogConfirm,
  MdCheckbox,
  MdTooltip,
  MdMenu,
  MdList,
  MdProgress
} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css'; // use custom theme in @/assets/main.scss instead
// import 'vue-material/dist/theme/default-dark.css'
Vue.use(MdButton);
Vue.use(MdField);
Vue.use(MdSnackbar);
Vue.use(MdDialog);
Vue.use(MdDialogAlert);
Vue.use(MdDialogConfirm);
Vue.use(MdCheckbox);
Vue.use(MdTooltip);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdProgress);
// vue-split-panel
import VueSplit from 'vue-split-panel';
Vue.use(VueSplit);

// vue-shortkey
Vue.use(require('vue-shortkey'));

Vue.config.productionTip = false;

new Vue({
  router: isElectron() ? routerElectron : routerWeb,
  store,
  i18n,
  beforeCreate() {
    this.$store.commit;
    this.$store.commit('settings/INIT_STORE_FROM_LOCAL_DATA');
  },
  render: h => h(isElectron() ? DesktopApp : WebApp)
}).$mount('#app');
