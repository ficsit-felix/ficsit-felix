import Vue from 'vue';
import Router from 'vue-router';
import Editor from '@/components/core/Editor.vue';
import LandingPageView from '@/components/web/LandingPageView.vue';
import LoadEditorView from '@/components/core/views/LoadEditorView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPageView
    },
    {
      path: '/loadeditor',
      name: 'loadEditor',
      component: LoadEditorView
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      meta: {
        requiresDataLoaded: true
      }
    },
    {
      path: '/open/*',
      name: 'open',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '../components/web/OpenView.vue')
    },
    {
      path: '*',
      name: '404',
      component: LandingPageView
    }
  ]
});
