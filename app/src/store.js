import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    data: {
      objects: []
    },
    selectedIndex: 11,
    error: null,
    title: "asdf"
  },
  getters: {
    getNames: state => {
      return state.data.objects.map(obj => obj.pathName.split(".")[1]);
    },
    getCount: state => {
      return state.data.objects.length;
    }
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SELECTED(state, selectedIndex) {
      state.selectedIndex = selectedIndex;
    }
  },
  actions: {
    loadData: context => {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:8000/big.json")
          .then(response => {
            context.commit("SET_DATA", response.data);
            resolve(response.data);
          })
          .catch(err => {
            context.commit("SET_ERROR", err);
            reject(err);
          });
      });
    },
    select(context, selectIndex) {
      context.commit("SET_SELECTED", selectIndex);
    }
  }
});
