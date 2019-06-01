import { Actor, Component, Property } from "satisfactory-json";


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


export function findActorByName(
  pathName: string
): Actor | undefined {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.actors.length; i++) {
      const element = window.data.actors[i];
      if (element.pathName === pathName) {
        return element;
      }
    }
  }
  return undefined;
}

export function indexOfActor(pathName: string): number {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.actors.length; i++) {
      const element = window.data.actors[i];
      if (element.pathName === pathName) {
        return i;
      }
    }
  }
  return -1;
}

export function findComponentByName(
  pathName: string
): Component | undefined {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.components.length; i++) {
      const element = window.data.components[i];
      if (element.pathName === pathName) {
        return element;
      }
    }
  }
  return undefined;
}

export function indexOfComponent(
  pathName: string
): number {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.components.length; i++) {
      const element = window.data.components[i];
      if (element.pathName === pathName) {
        return i;
      }
    }
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
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C"
  );
}

export function isConveyorLift(actor: Actor) {
  return (
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C" ||
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C"
  );
}

export function isPowerLine(actor: Actor) {
  return (
    actor.className ===
    "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C"
  );
}
