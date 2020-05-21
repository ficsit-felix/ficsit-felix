import Vue from 'vue';
import Router from 'vue-router';
import Editor from './components/core/Editor.vue';
import LandingPage from './components/web/LandingPage.vue';

import LoadEditorView from './components/core/LoadEditorView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage
    },
    {
      path: '/loadeditor',
      name: 'loadEditor',
      component: LoadEditorView
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/open/*',
      name: 'open',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './components/web/Open.vue')
    },
    {
      path: '*',
      name: '404',
      component: LandingPage
    }
  ]
});
