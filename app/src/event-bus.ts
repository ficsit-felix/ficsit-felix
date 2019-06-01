import Vue from "vue";

/**
 * global event bus
 *
 * replacement as we cannot easily subscribe to certain mutations/actions on the vuex store
 *
 * currently used for
 * - delete: {actors:[], components:[]} // emitted whenever something is deleted, so that the Playground can remove the corresponding meshes
 */
export const EventBus = new Vue();
