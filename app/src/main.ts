import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { ComponentOptions } from "vue";
import { commithash } from "@/js/commithash";

import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://4bee35ee7cba4ba194c9e1a575948656@sentry.io/1416938",
    release: commithash,
    integrations: [
      new Sentry.Integrations.Vue({
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
  MdDialogConfirm,
  MdCheckbox,
  MdTooltip,
  MdMenu,
  MdList
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css"; // use custom theme in @/assets/main.scss instead
// import 'vue-material/dist/theme/default-dark.css'
Vue.use(MdButton);
Vue.use(MdField);
Vue.use(MdSnackbar);
Vue.use(MdDialog);
Vue.use(MdDialogConfirm);
Vue.use(MdCheckbox);
Vue.use(MdTooltip);
Vue.use(MdMenu);
Vue.use(MdList);
// vue-split-panel
import VueSplit from "vue-split-panel";
Vue.use(VueSplit);

// vue-shortkey
Vue.use(require("vue-shortkey"));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
