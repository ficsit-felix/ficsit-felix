import Vue from 'vue';
import Router from 'vue-router';
import EditorView from './components/desktop/EditorView.vue';
//import Editor from './components/core/Editor.vue';
import MainScreen from './components/desktop/MainScreen.vue';
import ProgressBarDialog from './components/core/ProgressBarDialog.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: MainScreen
    },
    // TODO REMOVE
    {
      path: '/progressbar',
      name: 'progressbar',
      component: ProgressBarDialog
    },

    {
      path: '/editor',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/open/*',
      name: 'open',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './components/core/Open.vue')
    },
    {
      path: '/save/*',
      name: 'save',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './components/core/Save.vue')
    },
    {
      path: '*',
      name: '404',
      component: MainScreen
    }
  ]
});
