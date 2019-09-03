import Vue from 'vue';
import Vuex from 'vuex';
import { Module } from 'vuex';
import { Vector3 } from 'three';
import { Component, Actor } from 'satisfactory-json';
import {
  findActorByName,
  findComponentByName,
  indexOfComponent,
  indexOfActor,
  refreshActorComponentDictionary
} from './helpers/entityHelper';
import * as Sentry from '@sentry/browser';
import { EventBus } from './event-bus';
import { reportException } from '@/ts/errorReporting';

Vue.use(Vuex);

// Add the data object to the window interface
// see https://stackoverflow.com/a/12709880
declare global {
  interface Window {
    data: any;
  }
}

interface SettingsRootState {
  nearPlane: number;
  farPlane: number;
  showModels: boolean;
  showCustomPaints: boolean;
  showMap: boolean;
  conveyorBeltResolution: number;
  editClassColors: boolean;
  classColors: { [id: string]: string };
  locale: string;
  experimentalFeatures: boolean;
  autoLoadSaveFile: string;
  saveAsZip: boolean;
  showFps: boolean;
  showDevelopSettings: boolean;
}

// updates the local storage on settings mutations
// TODO do this in a better way?
function updateLocalStorage(state: SettingsRootState) {
  localStorage.setItem('settings', JSON.stringify(state));
}

const settingsModule: Module<SettingsRootState, RootState> = {
  namespaced: true,
  state: {
    nearPlane: 100,
    farPlane: 200000,
    showModels: true,
    showCustomPaints: true,
    showMap: true,
    conveyorBeltResolution: 4,
    editClassColors: false,
    classColors: {},
    locale: 'en',
    experimentalFeatures: false,
    autoLoadSaveFile: '',
    saveAsZip: false,
    showFps: false,
    showDevelopSettings: false
  },
  getters: {},
  mutations: {
    INIT_STORE_FROM_LOCAL_DATA(state) {
      if (localStorage.getItem('settings')) {
        Object.assign(state, JSON.parse(localStorage.getItem('settings')!));
      }
    },

    SET_NEAR_PLANE(state, payload) {
      state.nearPlane = parseFloat(payload);
      updateLocalStorage(state);
    },
    SET_FAR_PLANE(state, payload) {
      state.farPlane = parseFloat(payload);
      updateLocalStorage(state);
    },
    SET_SHOW_MODELS(state, payload) {
      state.showModels = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_CUSTOM_PAINTS(state, payload) {
      state.showCustomPaints = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_MAP(state, payload) {
      state.showMap = payload;
      updateLocalStorage(state);
    },
    SET_CONVEYOR_BELT_RESOLUTION(state, payload) {
      state.conveyorBeltResolution = payload;
      updateLocalStorage(state);
    },
    SET_CLASS_COLOR(state, payload) {
      Vue.set(state.classColors, payload.className, payload.color);
      // state.classColors[payload.className] = payload.color;
      updateLocalStorage(state);
    },
    SET_EDIT_CLASS_COLORS(state, payload) {
      state.editClassColors = payload;
      updateLocalStorage(state);
    },
    CLEAR_CLASS_COLORS(state, payload) {
      state.classColors = {};
      updateLocalStorage(state);
    },
    SET_LOCALE(state, payload) {
      state.locale = payload;
      updateLocalStorage(state);
    },
    SET_EXPERIMENTAL_FEATURES(state, payload) {
      state.experimentalFeatures = payload;
      updateLocalStorage(state);
    },
    SET_AUTO_LOAD_SAVE_FILE(state, payload) {
      state.autoLoadSaveFile = payload;
      updateLocalStorage(state);
    },
    SET_SAVE_AS_ZIP(state, payload) {
      state.saveAsZip = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_FPS(state, payload) {
      state.showFps = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_DEVELOP_SETTINGS(state, payload) {
      state.showDevelopSettings = payload;
      updateLocalStorage(state);
    }
  },
  actions: {
    setNearPlane(context, payload) {
      context.commit('SET_NEAR_PLANE', payload);
    },
    setFarPlane(context, payload) {
      context.commit('SET_FAR_PLANE', payload);
    },
    setShowModels(context, payload) {
      context.commit('SET_SHOW_MODELS', payload);
    },
    setShowCustomPaints(context, payload) {
      context.commit('SET_SHOW_CUSTOM_PAINTS', payload);
    },
    setShowMap(context, payload) {
      context.commit('SET_SHOW_MAP', payload);
    },
    setConveyorBeltResolution(context, payload) {
      context.commit('SET_CONVEYOR_BELT_RESOLUTION', payload);
    },
    setClassColor(context, payload) {
      context.commit('SET_CLASS_COLOR', payload);
    },
    setEditClassColors(context, payload) {
      context.commit('SET_EDIT_CLASS_COLORS', payload);
    },
    clearClassColors(context, payload) {
      context.commit('CLEAR_CLASS_COLORS', payload);
    },
    setLocale(context, payload) {
      context.commit('SET_LOCALE', payload);
    },
    setExperimentalFeatures(context, payload) {
      context.commit('SET_EXPERIMENTAL_FEATURES', payload);
    },
    setAutoLoadSaveFile(context, payload) {
      context.commit('SET_AUTO_LOAD_SAVE_FILE', payload);
    },
    setSaveAsZip(context, payload) {
      context.commit('SET_SAVE_AS_ZIP', payload);
    },
    setShowFps(context, payload) {
      context.commit('SET_SHOW_FPS', payload);
    },
    setShowDevelopSettings(context, payload) {
      context.commit('SET_SHOW_DEVELOP_SETTINGS', payload);
    }
  }
};

interface RootState {
  loading: boolean;

  selectedPathNames: string[];
  selectedActors: Actor[]; // TODO only store the pathNames of selected actors / components?
  selectedComponents: Component[];
  selectedJsonToEdit: any; // if one actor or component is selected, it's json is editable

  error: any;
  title: string;
  dataLoaded: boolean;
  visibleObjects: any[];
  uuid: string;
  filename: string;
  classes: any[];

  cameraTarget?: Vector3;
  cameraPosition?: Vector3;

  // controls
  selectionDisabled: boolean;
  boxSelect: boolean;
  shiftSelect: boolean;

  // loading
  progress: number;
  showSaveMenuEntries: boolean;
}

export default new Vuex.Store<RootState>({
  modules: {
    settings: settingsModule
  },
  state: {
    loading: false,

    selectedPathNames: [],
    selectedActors: [],
    selectedComponents: [],
    selectedJsonToEdit: null,

    error: null,
    title: 'asdf',
    dataLoaded: false,
    visibleObjects: [],
    uuid: '',
    filename: '',
    classes: [],

    selectionDisabled: false,
    boxSelect: false,
    shiftSelect: false,

    progress: 0,
    showSaveMenuEntries: false
  },
  getters: {
    getNames: state => {
      if (!state.dataLoaded) {
        return [];
      }

      const transformation = (obj: any, index: any) => {
        return {
          // id: index,
          pathName: obj.pathName,
          text: obj.pathName.substring(obj.pathName.indexOf('.') + 1)
          // everything after the first .
        };
      };

      return window.data.actors
        .map(transformation)
        .concat(window.data.components.map(transformation));
    },
    getVisibleObjects(state) {
      return state.visibleObjects;
    }
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SELECTED(state, selectedPathNames) {
      if (
        selectedPathNames.length === 1 &&
        selectedPathNames[0] === '---save-header---'
      ) {
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
        state.selectedJsonToEdit = header;
        state.selectedPathNames = selectedPathNames;
      } else {
        if (state.shiftSelect) {
          if (selectedPathNames.length === 0) {
            // nothing needs to change
            return;
          }
          if (selectedPathNames.length === 1) {
            // If only one is selected, toggle depending on if it was already in the list or not
            if (state.selectedPathNames.includes(selectedPathNames[0])) {
              // remove
              selectedPathNames = state.selectedPathNames.filter(
                pathName => pathName !== selectedPathNames[0]
              );
            } else {
              // add
              selectedPathNames = state.selectedPathNames.concat(
                selectedPathNames
              );
            }
          } else {
            // Merge old and new selectedPathNames

            for (const pathName of state.selectedPathNames) {
              if (!selectedPathNames.includes(pathName)) {
                selectedPathNames.push(pathName);
              }
            }
          }
        }

        state.selectedPathNames = selectedPathNames;

        const actors: Actor[] = [];
        const components: Component[] = [];

        state.selectedActors = actors;
        state.selectedComponents = components;

        for (const pathName of selectedPathNames) {
          const actor = findActorByName(pathName);
          if (actor !== undefined) {
            actors.push(actor);
          } else {
            const component = findComponentByName(pathName);
            if (component !== undefined) {
              components.push(component);
            } else {
              console.error(
                `No actor/component with path name '${pathName}' found.`
              );
              reportException(
                `No actor/component with path name '${pathName}' found.`
              );
            }
          }
        }

        if (selectedPathNames.length === 1) {
          // the object / actor is editable
          if (actors.length === 1) {
            state.selectedJsonToEdit = actors[0];
          } else if (components.length === 1) {
            state.selectedJsonToEdit = components[0];
          } else {
            state.selectedJsonToEdit = null;
          }
        } else {
          state.selectedJsonToEdit = null;
        }
      }
    },
    SET_VISIBLE_OBJECTS(state, visibleObjects) {
      state.selectedPathNames = [];
      state.selectedActors = [];
      state.selectedComponents = [];
      state.selectedJsonToEdit = null;

      state.visibleObjects = visibleObjects;

      state.classes = (state.visibleObjects as any[])
        .map(obj => obj.className)
        .filter((value, index, self) => self.indexOf(value) === index) // uniq
        .sort()
        .map(name => {
          return {
            name,
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
      for (const clazz of state.classes) {
        if (clazz.name === name) {
          clazz.visible = visible;
          break;
        }
      }
    },
    // TODO rename to update selected json
    SET_SELECTED_OBJECT(state, obj) {
      if (
        state.selectedPathNames.length === 1 &&
        state.selectedPathNames[0] === '---save-header---'
      ) {
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
        // TODO handle components as well
        if (obj.type === 1) {
          window.data.actors[
            indexOfActor(state.selectedActors[0].pathName)
          ] = obj;
          state.selectedActors = [obj];
        } else {
          window.data.components[
            indexOfComponent(state.selectedComponents[0].pathName)
          ] = obj;
          state.selectedComponents = [obj];
        }
      }

      state.selectedJsonToEdit = obj;
      // TODO need to update selectedActors / selectedComponents
    },
    SET_CAMERA_DATA(state, data) {
      state.cameraPosition = data.position;
      state.cameraTarget = data.target;
    },
    DELETE_SELECTED(state, payload) {
      // store the event payload here, but send it later,
      // so that selectedActors is set to [] before the meshes are deleted.
      // This way we don't get problems when trying to delect them.
      const eventPayload = {
        actors: state.selectedActors,
        components: state.selectedComponents
      };

      state.dataLoaded = false; // trigger recalculation of getNames
      for (const actor of state.selectedActors) {
        window.data.actors.splice(indexOfActor(actor.pathName), 1);
      }
      for (const component of state.selectedComponents) {
        window.data.components.splice(indexOfComponent(component.pathName), 1);
      }
      refreshActorComponentDictionary();

      state.selectedActors = [];
      state.selectedComponents = [];
      state.selectedJsonToEdit = null;
      state.selectedPathNames = [];
      state.dataLoaded = true;
      EventBus.$emit('delete', eventPayload);
    },

    SET_SELECTION_DISABLED(state, payload) {
      state.selectionDisabled = payload;
    },
    SET_BOX_SELECT(state, payload) {
      state.boxSelect = payload;
    },
    SET_SHIFT_SELECT(state, payload) {
      state.shiftSelect = payload;
    },
    SET_PROGRESS(state, payload) {
      state.progress = payload;
    },
    SET_SHOW_SAVE_MENU_ENTRIES(state, payload) {
      state.showSaveMenuEntries = payload;
    }
  },
  actions: {
    select(context, selectedPathNames) {
      context.commit('SET_SELECTED', selectedPathNames);
    },
    setLoading(context, value) {
      // this is needed so that the objects list will be updated
      // when we set the dataLoaded state back to true
      context.commit('SET_DATA_LOADED', value);
    },
    setLoadedData(context, data) {
      return new Promise((resolve, reject) => {
        window.data = data;
        refreshActorComponentDictionary();
        context.commit('SET_DATA_LOADED', true);

        // slowly fill visible actors
        const visible = [];
        for (let i = 0; i < data.actors.length; i++) {
          const actor = data.actors[i];
          visible.push({
            id: i,
            className: actor.className,
            transform: actor.transform
            // state: 0
          });
        }
        context.commit('SET_VISIBLE_OBJECTS', visible);
        resolve();
      });
    },
    setFilename(context, filename) {
      context.commit('SET_FILENAME', filename);
    },
    setUUID(context, uuid) {
      context.commit('SET_UUID', uuid);
    },
    setVisibility(context, payload) {
      context.commit('SET_VISIBILITY', payload);
    },
    setSelectedObject(context, payload) {
      context.commit('SET_SELECTED_OBJECT', payload);
    },
    setCameraData(context, payload) {
      context.commit('SET_CAMERA_DATA', payload);
    },
    deleteSelected(context, payload) {
      context.commit('DELETE_SELECTED', payload);
    },
    setSelectionDisabled(context, payload) {
      context.commit('SET_SELECTION_DISABLED', payload);
    },
    setBoxSelect(context, payload) {
      context.commit('SET_BOX_SELECT', payload);
    },
    setShiftSelect(context, payload) {
      context.commit('SET_SHIFT_SELECT', payload);
    },
    setProgress(context, payload) {
      context.commit('SET_PROGRESS', payload);
    },
    setShowSaveMenuEntries(context, payload) {
      context.commit('SET_SHOW_SAVE_MENU_ENTRIES', payload);
    }
  }
});
