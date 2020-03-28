import Vue from 'vue';

import store from './store';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import vuetify from './plugins/vuetify';

import { i18n } from './plugins/i18n';
import { isElectron } from './ts/isElectron';
import '@/helpers/cmdHelper';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://4bee35ee7cba4ba194c9e1a575948656@sentry.io/1416938',
    release: process.env.PACKAGE_VERSION,
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  });
}

// vue-material
/*import {
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
Vue.use(MdProgress);*/

// vue-split-panel
import VueSplit from '@bitowl/vue-split-panel';
import { EventBus } from './event-bus';
import { CHANGE_LOCALE } from './ts/constants';
Vue.use(VueSplit);

// vue-shortkey
Vue.use(require('vue-shortkey'));

Vue.config.productionTip = false;

let router;
if (isElectron()) {
  router = require('./router_electron').default;
} else {
  router = require('./router_web').default;
}
new Vue({
  router,
  store,
  vuetify,
  i18n,
  beforeCreate() {
    this.$store.commit;
    this.$store.commit('settings/INIT_STORE_FROM_LOCAL_DATA');
  },
  render: h =>
    h(
      isElectron()
        ? require('./components/desktop/DesktopApp.vue').default
        : require('./components/web/WebApp.vue').default
    )
}).$mount('#app');

// Set persisted locale
const lang = store.state.settings.locale;
import(`@/lang/${lang}.json`).then(msgs => {
  i18n.setLocaleMessage(lang, msgs.default || msgs);
  i18n.locale = lang;
  EventBus.$emit(CHANGE_LOCALE);
});
