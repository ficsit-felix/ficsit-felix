import { Module, Commit } from 'vuex';
import Vue from 'vue';
import { RootState } from '.';
import { Actor } from 'satisfactory-json';
import { glStack } from 'vue-golden-layout';

interface Action {
  name: string;
  undo: (commit: Commit, rootState: RootState) => Action;
}

interface UndoState {
  undoStack: Action[];
  redoStack: Action[];
}

export const undo: Module<UndoState, RootState> = {
  namespaced: true,
  state: {
    undoStack: [],
    redoStack: []
  },
  getters: {
    undoDisabled(state) {
      return state.undoStack.length == 0;
    },
    redoDisabled(state) {
      return state.redoStack.length == 0;
    }
  },
  mutations: {
    ADD_ACTION(state, payload) {
      state.undoStack.push(payload);
      state.redoStack = [];
      console.log(
        `undo: ${state.undoStack.length} redo: ${state.redoStack.length}`
      );
    },
    UNDO_ACTION(state, action) {
      state.redoStack.push(action);
      state.undoStack.pop();
      console.log(
        `undo: ${state.undoStack.length} redo: ${state.redoStack.length}`
      );
    },
    REDO_ACTION(state, action) {
      state.undoStack.push(action);
      state.redoStack.pop();
      console.log(
        `undo: ${state.undoStack.length} redo: ${state.redoStack.length}`
      );
    }
  },
  actions: {
    recordAction({ commit }, action) {
      commit('ADD_ACTION', action);
    },
    undoLastAction({ commit, state, rootState }) {
      if (state.undoStack.length > 0) {
        const redoAction = state.undoStack[state.undoStack.length - 1].undo(
          commit,
          rootState
        );
        commit('UNDO_ACTION', redoAction);
      }
    },
    redoLastAction({ commit, state, rootState }) {
      if (state.redoStack.length > 0) {
        const undoAction = state.redoStack[state.redoStack.length - 1].undo(
          commit,
          rootState
        );
        commit('REDO_ACTION', undoAction);
      }
    }
  }
};

export class SelectAction implements Action {
  constructor(public name: string, private selectedPathNames: string[]) {}
  undo(commit: Commit, rootState: RootState) {
    const redo = new SelectAction(this.name, rootState.selectedPathNames);
    console.log('undo: ' + this.selectedPathNames.length);
    commit('SET_SELECTED', this.selectedPathNames, { root: true });
    return redo;
  }
}

export class TransformAction implements Action {
  constructor(
    public name: string,
    private transform: string // store transform as string, so that it loses it's reactivity
  ) {}
  // TODO handle multiple selected
  undo(commit: Commit, rootState: RootState) {
    const transformedActor = rootState.selectedActors[0];
    console.log(transformedActor.transform.translation);

    const redo = new TransformAction(
      this.name,
      JSON.stringify(transformedActor.transform)
    );

    transformedActor.transform = JSON.parse(this.transform);
    console.log(transformedActor.transform.translation);
    commit('SET_SELECTED_OBJECT', transformedActor, { root: true });
    return redo;
  }
}

// TODO maybe only store the difference or else the vuex store might be filled quickly?
export class JsonAction implements Action {
  constructor(public name: string, private json: string) {}
  // TODO handle multiple selected
  undo(commit: Commit, rootState: RootState) {
    const redo = new JsonAction(
      this.name,
      JSON.stringify(rootState.selectedJsonToEdit)
    );
    commit('SET_SELECTED_OBJECT', JSON.parse(this.json), { root: true });
    return redo;
  }
}
