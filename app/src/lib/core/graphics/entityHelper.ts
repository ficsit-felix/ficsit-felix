import { Actor, Component, Property } from 'satisfactory-json';

let actorByPathName: { [id: string]: number } = {};
let componentByPathName: { [id: string]: number } = {};

/**
 * refresh the two dictionaries above that are used to quickly look up actors and components by their path name
 *
 * needs to be called whenever the indices of window.data.actors or window.data.components change
 */
export function refreshActorComponentDictionary() {
  actorByPathName = {};
  componentByPathName = {};
  if (window.data === undefined) return;
  for (let i = 0; i < window.data.actors.length; i++) {
    const actor = window.data.actors[i];
    actorByPathName[actor.pathName] = i;
  }
  for (let i = 0; i < window.data.components.length; i++) {
    const component = window.data.components[i];
    componentByPathName[component.pathName] = i;
  }
}

export function getProperty(
  actor: Actor,
  propertyName: string
): Property | undefined {
  if (actor.entity !== undefined) {
    if (actor.entity.properties !== undefined) {
      for (let i = 0; i < actor.entity.properties.length; i++) {
        const property = actor.entity.properties[i];
        if (property.name === propertyName) {
          return property;
        }
      }
    }
  }
  return undefined;
}
export function getPropertyFromComponent(
  component: Component,
  propertyName: string
): Property | undefined {
  if (component.entity !== undefined) {
    if (component.entity.properties !== undefined) {
      for (let i = 0; i < component.entity.properties.length; i++) {
        const property = component.entity.properties[i];
        if (property.name === propertyName) {
          return property;
        }
      }
    }
  }
  return undefined;
}

export function findActorByName(pathName: string): Actor | undefined {
  if (window.data !== undefined) {
    const index = actorByPathName[pathName];
    if (index !== undefined) {
      return window.data.actors[index];
    }

    /*// TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.actors.length; i++) {
      const element = window.data.actors[i];
      if (element.pathName === pathName) {
        return element;
      }
    }*/
  }
  return undefined;
}

export function indexOfActor(pathName: string): number {
  if (window.data !== undefined) {
    const index = actorByPathName[pathName];
    return index;
    /*
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.actors.length; i++) {
      const element = window.data.actors[i];
      if (element.pathName === pathName) {
        return i;
      }
    }*/
  }
  return -1;
}

export function findComponentByName(pathName: string): Component | undefined {
  if (window.data !== undefined) {
    const index = componentByPathName[pathName];
    if (index !== undefined) {
      return window.data.components[index];
    }
    // TODO might be worth optimizing using hashmap or the like
    /*for (let i = 0; i < window.data.components.length; i++) {
      const element = window.data.components[i];
      if (element.pathName === pathName) {
        return element;
      }
    }*/
  }
  return undefined;
}

export function indexOfComponent(pathName: string): number {
  if (window.data !== undefined) {
    const index = componentByPathName[pathName];
    return index;
    // TODO might be worth optimizing using hashmap or the like
    /*for (let i = 0; i < window.data.components.length; i++) {
      const element = window.data.components[i];
      if (element.pathName === pathName) {
        return i;
      }
    }*/
  }
  return -1;
}

/**
 * Returns true if the passed actor is a conveyor belt
 * @param actor
 */
export function isConveyorBelt(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C'
  );
}

export function isConveyorLift(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk5/Build_ConveyorLiftMk5.Build_ConveyorLiftMk5_C'
  );
}

export function isRailroadTrack(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrack.Build_RailroadTrack_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrackIntegrated.Build_RailroadTrackIntegrated_C'
  );
}

export function isPowerLine(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C' ||
    actor.className ===
      '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C'
  );
}

export function isPipe(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/Pipeline/Build_Pipeline.Build_Pipeline_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PipeHyper/Build_PipeHyper.Build_PipeHyper_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PipelineMk2/Build_PipelineMK2.Build_PipelineMK2_C'
  );
}

export function isSpline(actor: Actor) {
  return isConveyorBelt(actor) || isRailroadTrack(actor) || isPipe(actor);
}

export function isPowerPoleWallDouble(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PowerPoleWallDouble/Build_PowerPoleWallDouble_Mk2.Build_PowerPoleWallDouble_Mk2_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PowerPoleWallDouble/Build_PowerPoleWallDouble_Mk3.Build_PowerPoleWallDouble_Mk3_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PowerPoleWallDouble/Build_PowerPoleWallDouble.Build_PowerPoleWallDouble_C'
  );
}
export function isPipeSupport(actor: Actor) {
  return (
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PipeHyperSupport/Build_PipeHyperSupport.Build_PipeHyperSupport_C' ||
    actor.className ===
      '/Game/FactoryGame/Buildable/Factory/PipelineSupport/Build_PipelineSupport.Build_PipelineSupport_C'
  );
}
export function isLadder(actor: Actor) {
  return (
    actor.className ===
    '/Game/FactoryGame/Buildable/Building/Ladder/Build_Ladder.Build_Ladder_C'
  );
}
export function isAdjustableJumpPad(actor: Actor) {
  return (
    actor.className ===
    '/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPadAdjustable.Build_JumpPadAdjustable_C'
  );
}
export function isPowerSwitch(actor: Actor) {
  return (
    actor.className ===
    '/Game/FactoryGame/Buildable/Factory/PowerSwitch/Build_PowerSwitch.Build_PowerSwitch_C'
  );
}
export function isLightsControlPanel(actor: Actor) {
  return (
    actor.className ===
    '/Game/FactoryGame/Buildable/Factory/LightsControlPanel/Build_LightsControlPanel.Build_LightsControlPanel_C'
  );
}
