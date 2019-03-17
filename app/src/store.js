import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    selectedIndex: -1,
    error: null,
    title: "asdf",
    dataLoaded: false,
    visibleObjects: []
  },
  getters: {
    getNames: state => {
      if (!state.dataLoaded) {
        return [];
      }
      return window.data.objects.map((obj, index) => {
        return {
          id: index,
          text: obj.pathName.split(".")[1]
        };
      });
    },
    getSelectedObject: state => {
      if (state.selectedIndex === -1) {
        return null;
      } else {
        return window.data.objects[state.selectedIndex];
      }
    },
    getVisibleObjects(state) {
      return state.visibleObjects;
    }
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SELECTED(state, selectedIndex) {
      /*if (state.selectedIndex !== -1) {
        state.visibleObjects[state.selectedIndex].state = 0;
      }*/
      state.selectedIndex = selectedIndex;
      /*if (state.selectedIndex !== -1) {
        state.visibleObjects[state.selectedIndex].state = 1;
      }*/
    },
    SET_VISIBLE_OBJECTS(state, visibleObjects) {
      state.visibleObjects = visibleObjects;
    },
    SET_DATA_LOADED(state, dataLoaded) {
      state.dataLoaded = dataLoaded;
    }
  },
  actions: {
    loadData: context => {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:8000/big.json")
          .then(response => {
            window.data = response.data;

            context.commit("SET_DATA_LOADED", true);

            // slowly fill visible objects
            var visible = [];
            for (var i = 0; i < response.data.objects.length; i++) {
              var obj = response.data.objects[i];
              if (obj.type === 1) {
                visible.push({
                  id: i,
                  className: obj.className,
                  transform: obj.transform
                  // state: 0
                });
              }
            }
            context.commit("SET_VISIBLE_OBJECTS", visible);

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
