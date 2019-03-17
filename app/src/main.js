import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://4bee35ee7cba4ba194c9e1a575948656@sentry.io/1416938",
    integrations: [
      new Sentry.Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  });
}

// vue-material
import { MdButton, MdField } from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
/*import 'vue-material/dist/theme/default-dark.css'*/
Vue.use(MdButton);
Vue.use(MdField);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
