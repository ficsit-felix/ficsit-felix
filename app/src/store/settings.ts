import { Module } from 'vuex';
import Vue from 'vue';
import { RootState } from '.';

export enum MapType {
  None,
  Render,
  Ingame
}

// Whenever the vue components in the editor is changed, we need to use a new layout version and reset old layout states
enum LayoutVersion {
  Initial,
  AddPropertiesPanel,
  SeparateLayoutSettings
}

export enum CameraType {
  Orbit,
  Fly,
  Flat
}

const currentLayoutVersion = LayoutVersion.SeparateLayoutSettings;

interface SettingsRootState {
  nearPlane: number;
  farPlane: number;
  showModels: boolean;
  showCustomPaints: boolean;
  mapType: MapType;
  conveyorBeltResolution: number;
  editClassColors: boolean;
  classColors: { [id: string]: string };
  locale: string;
  experimentalFeatures: boolean;
  autoLoadSaveFile: string;
  showFps: boolean;
  showDevelopSettings: boolean;
  layout: any; // Golden Layout state
  layoutVersion: LayoutVersion;
  snapping: boolean;
  translationSnap: number;
  rotationSnap: number;
  cameraType: CameraType;
  showPropertiesPanel: boolean;
  // Separate properties that describe the current properties of the layout state, necessary as the settings properties can be changed outside of the editor when the layout does not adapt
  layoutSettings: {
    propertiesPanelEnabled: boolean;
  };
}

// updates the local storage on settings mutations
// TODO do this in a better way?
function updateLocalStorage(state: SettingsRootState) {
  localStorage.setItem('settings', JSON.stringify(state));
}

const defaultState = () => {
  return {
    nearPlane: 100,
    farPlane: 200000,
    showModels: true,
    showCustomPaints: true,
    mapType: MapType.Render,
    conveyorBeltResolution: 4,
    editClassColors: false,
    classColors: {},
    locale: 'en',
    experimentalFeatures: false,
    autoLoadSaveFile: '',
    showFps: false,
    showDevelopSettings: false,
    layout: null,
    layoutVersion: currentLayoutVersion,
    snapping: false,
    translationSnap: 100,
    rotationSnap: 45,
    cameraType: CameraType.Orbit,
    showPropertiesPanel: false,
    layoutSettings: {
      propertiesPanelEnabled: false
    }
  };
};

export const settingsModule: Module<SettingsRootState, RootState> = {
  namespaced: true,
  state: defaultState(),
  getters: {},
  mutations: {
    INIT_STORE_FROM_LOCAL_DATA(state) {
      if (localStorage.getItem('settings')) {
        Object.assign(state, JSON.parse(localStorage.getItem('settings')!));

        // Reset the layout state if it was not created with the current component tree
        if (state.layoutVersion !== currentLayoutVersion) {
          state.layout = null;
          state.layoutVersion = currentLayoutVersion;
        }
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
    SET_MAP_TYPE(state, payload) {
      state.mapType = payload;
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
    SET_SHOW_FPS(state, payload) {
      state.showFps = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_DEVELOP_SETTINGS(state, payload) {
      state.showDevelopSettings = payload;
      updateLocalStorage(state);
    },
    SET_LAYOUT(state, payload) {
      state.layout = payload;
      updateLocalStorage(state);
    },
    SET_SNAPPING(state, payload) {
      state.snapping = payload;
      updateLocalStorage(state);
    },
    SET_TRANSLATION_SNAP(state, payload) {
      state.translationSnap = payload;
      updateLocalStorage(state);
    },
    SET_ROTATION_SNAP(state, payload) {
      state.rotationSnap = payload;
      updateLocalStorage(state);
    },
    SET_CAMERA_TYPE(state, payload) {
      state.cameraType = payload;
      updateLocalStorage(state);
    },
    SET_SHOW_PROPERTIES_PANEL(state, payload) {
      state.showPropertiesPanel = payload;
      updateLocalStorage(state);
    },
    RESET_SETTINGS(state) {
      const s = defaultState();
      Object.keys(s).forEach(key => {
        //@ts-ignore
        state[key] = s[key];
      });
      updateLocalStorage(state);
    },
    SET_PROPERTIES_PANEL_ENABLED(state, payload) {
      state.layoutSettings.propertiesPanelEnabled = payload;
      // no need to update local storage as this should trigger a layout change?
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
    setMapType(context, payload) {
      context.commit('SET_MAP_TYPE', payload);
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
    setShowFps(context, payload) {
      context.commit('SET_SHOW_FPS', payload);
    },
    setShowDevelopSettings(context, payload) {
      context.commit('SET_SHOW_DEVELOP_SETTINGS', payload);
    },
    setLayout(context, payload) {
      context.commit('SET_LAYOUT', payload);
    },
    resetLayout(context, payload) {
      context.commit('SET_LAYOUT', null);
    },
    setSnapping(context, payload) {
      context.commit('SET_SNAPPING', payload);
    },
    setTranslationSnap(context, payload) {
      context.commit('SET_TRANSLATION_SNAP', payload);
    },
    setRotationSnap(context, payload) {
      context.commit('SET_ROTATION_SNAP', payload);
    },
    setCameraType(context, payload) {
      context.commit('SET_CAMERA_TYPE', payload);
    },
    setShowPropertiesPanel(context, payload) {
      context.commit('SET_SHOW_PROPERTIES_PANEL', payload);
    },
    resetSettings(context, payload) {
      context.commit('RESET_SETTINGS');
    },
    setPropertiesPanelEnabled(context, payload) {
      context.commit('SET_PROPERTIES_PANEL_ENABLED', payload);
    }
  }
};
