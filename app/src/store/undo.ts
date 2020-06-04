import { Module } from 'vuex';
import Vue from 'vue';
import { RootState } from '.';
import { Actor } from 'satisfactory-json';

interface Action {
  name: string;
  undo: () => void;
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
  mutations: {
    ADD_ACTION(state, payload) {
      state.undoStack.push(payload);
      state.redoStack = [];
    }
  },
  actions: {
    recordAction({ commit }, action) {
      commit('ADD_ACTION', action);
    }
  }
};

export class TransformAction implements Action {
  constructor(
    public name: string,
    private pathName: string,
    private transform: {
      rotation: number[];
      translation: number[];
      scale3d: number[];
    }
  ) {}
  undo() {}
}
