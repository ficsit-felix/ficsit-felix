import LandingPageView from '@/components/web/LandingPageView.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPageView,
    },
    {
      path: '/loadeditor',
      name: 'loadEditor',
      component: () =>
        import(
          /* webpackChunkName: "editor" */ '@components/views/LoadEditorView.vue'
        ),
    },
    {
      path: '/editor',
      name: 'editor',
      component: () =>
        import(/* webpackChunkName: "editor" */ '@components/Editor.vue'),
      meta: {
        requiresDataLoaded: true,
      },
    },
    {
      path: '/open/*',
      name: 'open',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "editor" */ '@/components/web/OpenView.vue'
        ),
    },
    {
      path: '*',
      name: '404',
      component: LandingPageView,
    },
  ],
});
