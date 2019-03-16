import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    data: {
      saveVersion: 123,
      objects: [
        {
          position: [0, 0, 0],
          name: "test"
        }
      ]
    },
    title: "asdf"
  },
  mutations: {},
  actions: {}
});
