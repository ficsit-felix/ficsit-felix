import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { stat } from "fs";

Vue.use(Vuex);

// Add the data object to the window interface
// see https://stackoverflow.com/a/12709880
declare global {
  interface Window {
    data: any;
  }
}

interface RootState {
  loading: boolean;
  selectedIndex: number;
  selectedObject: any;
  error: any;
  title: string;
  dataLoaded: boolean;
  visibleObjects: any[];
  uuid: string;
  filename: string;
  classes: any[];
}

export default new Vuex.Store<RootState>({
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
      return window.data.objects.map((obj: any, index: any) => {
        return {
          id: index,
          text: obj.pathName.substring(obj.pathName.indexOf(".") + 1) // everything after the first .
        };
      });
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
      if (selectedIndex == -2) {
        // selected save header
        const header = {
          saveHeaderType: window.data.saveHeaderType,
          saveVersion: window.data.saveVersion,
          buildVersion: window.data.buildVersion,
          mapName: window.data.mapName,
          mapOptions: window.data.mapOptions,
          sessionName: window.data.sessionName,
          playDurationSeconds: window.data.playDurationSeconds,
          saveDateTime: window.data.saveDateTime,
          sessionVisibility: window.data.sessionVisibility,
          collected: window.data.collected,
          missing: window.data.missing
        };
        state.selectedObject = header;
      } else if (selectedIndex != -1) {
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

      state.classes = (state.visibleObjects as any[])
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
      if (state.selectedIndex === -2) {
        // header
        window.data.saveHeaderType = obj.saveHeaderType;
        window.data.saveVersion = obj.saveVersion;
        window.data.buildVersion = obj.buildVersion;
        window.data.mapName = obj.mapName;
        window.data.mapOptions = obj.mapOptions;
        window.data.sessionName = obj.sessionName;
        window.data.playDurationSeconds = obj.playDurationSeconds;
        window.data.saveDateTime = obj.saveDateTime;
        window.data.sessionVisibility = obj.sessionVisibility;
        window.data.collected = obj.collected;
        window.data.missing = obj.missing;
      } else {
        window.data.objects[state.selectedIndex] = obj;
      }
      state.selectedObject = obj;
    }
  },
  actions: {
    select(context, selectIndex) {
      context.commit("SET_SELECTED", selectIndex);
    },
    setLoading(context, value) {
      // this is needed so that the objects list will be updated when we set the dataLoaded state back to true
      context.commit("SET_DATA_LOADED", value);
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
      context.commit("SET_VISIBILITY", payload);
    },
    setSelectedObject(context, payload) {
      context.commit("SET_SELECTED_OBJECT", payload);
    }
  }
});
