import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { stat } from "fs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    selectedIndex: -1,
    selectedObject: null,
    error: null,
    title: "asdf",
    dataLoaded: false,
    visibleObjects: [],
    uuid: "",
    filename: "",
    classes: []
  },
  getters: {
    getNames: state => {
      if (!state.dataLoaded) {
        return [];
      }
      return window.data.objects.map((obj, index) => {
        return {
          id: index,
          text: obj.pathName.substring(obj.pathName.indexOf(".") + 1) // everything after the first .
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
      if (selectedIndex != -1) {
        state.selectedObject = window.data.objects[selectedIndex];
      } else {
        state.selectedObject = null;
      }
      /*if (state.selectedIndex !== -1) {
        state.visibleObjects[state.selectedIndex].state = 1;
      }*/
    },
    SET_VISIBLE_OBJECTS(state, visibleObjects) {
      state.selectedIndex = -1;
      state.visibleObjects = visibleObjects;

      state.classes = state.visibleObjects
        .map(obj => obj.className)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort()
        .map(name => {
          return {
            name: name,
            visible: true
          };
        });
    },
    SET_DATA_LOADED(state, dataLoaded) {
      state.dataLoaded = dataLoaded;
    },
    SET_FILENAME(state, filename) {
      state.filename = filename;
    },
    SET_UUID(state, uuid) {
      state.uuid = uuid;
    },
    SET_VISIBILITY(state, { name, visible }) {
      // console.log("mutation", name, visible);
      for (var i = 0; i < state.classes.length; i++) {
        if (state.classes[i].name === name) {
          state.classes[i].visible = visible;
          break;
        }
      }
    },
    SET_SELECTED_OBJECT(state, obj) {
      // console.log("STATE CHANGE", obj);
      window.data.objects[state.selectedIndex] = obj;
      state.selectedObject = obj;
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
    },
    setLoadedData(context, data) {
      return new Promise((resolve, reject) => {
        window.data = data;

        context.commit("SET_DATA_LOADED", true);

        // slowly fill visible objects
        var visible = [];
        for (var i = 0; i < data.objects.length; i++) {
          var obj = data.objects[i];
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
        resolve();
      });
    },
    setFilename(context, filename) {
      context.commit("SET_FILENAME", filename);
    },
    setUUID(context, uuid) {
      context.commit("SET_UUID", uuid);
    },
    setVisibility(context, payload) {
      console.log("action", payload);
      context.commit("SET_VISIBILITY", payload);
    },
    setSelectedObject(context, payload) {
      context.commit("SET_SELECTED_OBJECT", payload);
    }
  }
});
