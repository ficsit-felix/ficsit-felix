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
} from '@lib/graphics/entityHelper';
import * as Sentry from '@sentry/browser';
import { EventBus } from '@lib/event-bus';
import { reportException } from '@lib/errorReporting';
import { settingsModule } from './settings';
import { undo, SelectAction } from './undo';
Vue.use(Vuex);

// Add the data object to the window interface
// see https://stackoverflow.com/a/12709880
declare global {
  interface Window {
    data: any;
  }
}

export interface RootState {
  [x: string]: any;
  loading: boolean;

  selectedPathNames: string[];
  selectedActors: Actor[]; // TODO only store the pathNames of selected actors / components?
  selectedComponents: Component[];
  selectedJsonToEdit: any; // if one actor or component is selected, it's json is editable

  dataLoaded: boolean;
  uuid: string;
  filename: string;
  filepath: string;
  classes: any[];

  cameraTarget?: Vector3;
  cameraPosition?: Vector3;

  // controls
  selectionDisabled: boolean;
  boxSelect: boolean;
  shiftSelect: boolean;

  // loading
  progress: number;
  progressText: {
    title: string;
    currentStep: string;
    showCloseButton: boolean;
  };
  showSaveMenuEntries: boolean;
}

export default new Vuex.Store<RootState>({
  modules: {
    settings: settingsModule,
    undo
  },
  state: {
    loading: false,

    selectedPathNames: [],
    selectedActors: [],
    selectedComponents: [],
    selectedJsonToEdit: null,

    dataLoaded: false,
    uuid: '',
    filename: '',
    filepath: '',
    classes: [],

    selectionDisabled: false,
    boxSelect: false,
    shiftSelect: false,

    progress: 0,
    progressText: {
      title: '',
      currentStep: '',
      showCloseButton: false
    },
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
    }
  },
  mutations: {
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
    SET_CLASSES(state, classes) {
      state.selectedPathNames = [];
      state.selectedActors = [];
      state.selectedComponents = [];
      state.selectedJsonToEdit = null;

      state.classes = classes;
    },
    SET_DATA_LOADED(state, dataLoaded) {
      state.dataLoaded = dataLoaded;
    },
    SET_FILENAME(state, filename) {
      state.filename = filename;
    },
    SET_FILEPATH(state, filepath) {
      state.filepath = filepath;
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
    SET_VISIBILITY_FOR_ALL(state, visible) {
      // TODO does this send multiple change events or is this already the fastest way?
      for (const clazz of state.classes) {
        clazz.visible = visible;
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
        state.selectedActors = [];
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
    SET_PROGRESS_TEXT(state, payload) {
      if (payload.title !== undefined) {
        state.progressText.title = payload.title;
      }
      if (payload.currentStep !== undefined) {
        state.progressText.currentStep = payload.currentStep;
      }
      if (payload.showCloseButton !== undefined) {
        state.progressText.showCloseButton = payload.showCloseButton;
      }
    },
    SET_SHOW_SAVE_MENU_ENTRIES(state, payload) {
      state.showSaveMenuEntries = payload;
    }
  },
  actions: {
    select(context, selectedPathNames) {
      if (selectedPathNames != this.state.selectedPathNames) {
        // only add undo if this changed
        context.commit(
          'undo/ADD_ACTION',
          new SelectAction('SELECT', this.state.selectedPathNames)
        );
        context.commit('SET_SELECTED', selectedPathNames);
      }
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

        // set and array spread as a fast way to calculate unique class names https://stackoverflow.com/a/33121880
        const classNames = [
          ...new Set((data.actors as Actor[]).map(actor => actor.className))
        ]
          .sort()
          .map(name => {
            return {
              name,
              visible: true
            };
          });

        context.commit('SET_CLASSES', classNames);
        resolve();
      });
    },
    setFilename(context, filename) {
      context.commit('SET_FILENAME', filename);
    },
    setFilepath(context, filepath) {
      context.commit('SET_FILEPATH', filepath);
    },
    setUUID(context, uuid) {
      context.commit('SET_UUID', uuid);
    },
    setVisibility(context, payload) {
      context.commit('SET_VISIBILITY', payload);
    },
    setVisibilityForAll(context, payload) {
      context.commit('SET_VISIBILITY_FOR_ALL', payload);
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
    setProgressText(context, payload) {
      context.commit('SET_PROGRESS_TEXT', payload);
    },
    setShowSaveMenuEntries(context, payload) {
      context.commit('SET_SHOW_SAVE_MENU_ENTRIES', payload);
    }
  }
});
