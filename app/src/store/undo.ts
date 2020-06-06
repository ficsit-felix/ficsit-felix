import { Module, Commit } from 'vuex';
import { RootState } from '.';
import { Actor, Component } from 'satisfactory-json';

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
    },
    UNDO_ACTION(state, action) {
      state.redoStack.push(action);
      state.undoStack.pop();
    },
    REDO_ACTION(state, action) {
      state.undoStack.push(action);
      state.redoStack.pop();
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

    const redo = new TransformAction(
      this.name,
      JSON.stringify(transformedActor.transform)
    );

    transformedActor.transform = JSON.parse(this.transform);
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

export class DeleteAction implements Action {
  constructor(
    public name: string,
    private actorsJson: string,
    private componentsJson: string
  ) {}

  undo(commit: Commit, rootState: RootState) {
    const actors = JSON.parse(this.actorsJson);
    const components = JSON.parse(this.componentsJson);

    // TODO is it important that they are added at the same location? then we need to store the indices as well
    commit('CREATE_OBJECTS', { actors, components }, { root: true });
    // gather path names
    const actorPathNames = actors.map((actor: Actor) => actor.pathName);
    const componentPathNames = components.map(
      (component: Component) => component.pathName
    );

    return new CreateAction(this.name, actorPathNames, componentPathNames);
  }
}
export class CreateAction implements Action {
  constructor(
    public name: string,
    private actorPathNames: string[],
    private componentsPathNames: string[]
  ) {}
  undo(commit: Commit, rootState: RootState) {
    const redo = new DeleteAction(
      this.name,
      JSON.stringify(rootState.selectedActors),
      JSON.stringify(rootState.selectedComponents)
    );
    commit('DELETE_SELECTED', null, { root: true });
    return redo;
  }
}
