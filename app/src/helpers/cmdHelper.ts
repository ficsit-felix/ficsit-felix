import { Actor, Component } from 'satisfactory-json';

/**
 * Global functions that help developing
 */
declare global {
  interface Window {
    checkMissing: any;
  }
}

window.checkMissing = function() {
  if (window.data === undefined) {
    console.error('Need to load a save file first.');
    return;
  }

  for (const elem of window.data.actors) {
    const actor = elem as Actor;
    const missing = actor.entity.missing;
    if (missing !== undefined) {
      console.log('actor: ' + actor.className);
    }
  }

  for (const elem of window.data.components) {
    const component = elem as Component;
    const missing = component.entity.missing;
    if (missing !== undefined) {
      console.log('component: ' + component.className);
    }
  }
};
