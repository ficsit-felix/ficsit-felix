import { Actor, ActorOrComponent, Property } from "satisfactory-json";

export function getProperty(
  actor: ActorOrComponent,
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

export function findActorByName(
  levelName: string,
  pathName: string
): ActorOrComponent | undefined {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.objects.length; i++) {
      const element = window.data.objects[i];
      if (
        element.pathName === pathName && // compare by pathName first as if they are the same, the levelName will very probably be the same, too.
        element.levelName === levelName
      ) {
        return element;
      }
    }
  }
  return undefined;
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
