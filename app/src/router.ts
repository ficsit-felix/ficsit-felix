import Vue from "vue";
import Router from "vue-router";
import Editor from "./views/Editor.vue";
import LandingPage from "./views/LandingPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "landingpage",
      component: LandingPage,
    },
    {
      path: "/editor",
      name: "editor",
      component: Editor
    },
    {
      path: "/upload/*",
      name: "upload",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Upload.vue")
    },
    {
      path: "/download/*",
      name: "download",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Download.vue")
    }
  ]
});
