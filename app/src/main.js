import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as Sentry from "@sentry/browser";
Sentry.init({
  dsn: "https://4bee35ee7cba4ba194c9e1a575948656@sentry.io/1416938",
  integrations: [
    new Sentry.Integrations.Vue({
      Vue,
      attachProps: true
    })
  ]
});

import * as VueGL from "vue-gl";

Object.keys(VueGL).forEach(name => {
  Vue.component(name, VueGL[name]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
