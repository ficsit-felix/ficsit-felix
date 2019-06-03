/** dev version of the satisfactory-blueprint module, so that we get hot reloading */

import { Actor, Component, SaveGame, Property } from "satisfactory-json";
import { SatisfactoryBlueprint, Transform, classNameMap, Building, Vector3 } from "satisfactory-blueprint";
import { Quaternion, Euler } from 'three';


export interface InstantiatedBlueprint {
  newActors: Actor[];
  newComponents: Component[];
  changesToSubsystems: any; // TODO

}

/**
* Instantiates a blueprint and returns information needed to place the actors and components into the save game.
* @param blueprint The blueprint that should be instantiated
* @param transform Position and rotation at which the blueprint should be instantiated
* @param saveGame SaveGame to look up stuff in the subsystems
*/
export function createActorsFromBlueprint(blueprint: SatisfactoryBlueprint, transform: Transform, saveGame: SaveGame): InstantiatedBlueprint {
  throw Error("not implemented ho")
}

/**
* Creates a new blueprint from the set of actors 
* @param actorsToInclude All the actors that should make up the blueprint
* @param saveGame The save game is needed to look up stuff in the subsystems and in the corresponding components
*/
export function createBlueprintFromActors(actorsToInclude: Actor[], saveGame: SaveGame): SatisfactoryBlueprint {
  const blueprintCreator = new BlueprintCreator(actorsToInclude, saveGame);
  return blueprintCreator.blueprint;
}

class BlueprintCreator {
  blueprint: SatisfactoryBlueprint;
  origin: Vector3;

  public constructor(actorsToInclude: Actor[], saveGame: SaveGame) {
    // create minimal blueprint object
    this.blueprint = {
      schemaVersion: "0.0.1",
      gameVersion: saveGame.buildVersion,
      meta: {},
      buildings: [],
      connections: []
    };

    const includedActors = this.filterActors(actorsToInclude);
    this.origin = this.calculateOrigin(actorsToInclude);

    this.iterateActors(includedActors, saveGame);
  }

  private filterActors(actors: Actor[]): Actor[] {
    const includedActors = [];
    for (const actor of actors) {
      if (classNameMap[actor.className] === undefined) {
        // ignore this actor as it is not represented in a blueprint
        continue;
      }
      includedActors.push(actor);
    }
    return includedActors;
  }

  // currently simply take the center in x and y and the lowest value in z
  private calculateOrigin(actors: Actor[]): Vector3 {
    const origin = {
      x: 0,
      y: 0,
      z: Number.MAX_SAFE_INTEGER,
    };

    for (const actor of actors) {
      origin.x += actor.transform.translation[0];
      origin.y += actor.transform.translation[1];
      if (actor.transform.translation[2] < origin.z) {
        origin.z = actor.transform.translation[2];
      }
    }

    origin.x = origin.x / actors.length;
    origin.y = origin.y / actors.length;
    return origin;
  }

  private iterateActors(actors: Actor[], saveGame: SaveGame) {
    for (const actor of actors) {
      const classAndMark = classNameMap[actor.className];
      if (isConnection(classAndMark.className)) {
        this.createConnection(actor, saveGame, classAndMark.className, classAndMark.mark);
      } else {
        this.createBuilding(actor, saveGame, classAndMark.className, classAndMark.mark);
      }
    }
  }

  private createBuilding(actor: Actor, saveGame: SaveGame, className: string, mark?: number) {
    const building: Building = {
      pathName: this.convertPathName(actor.pathName),
      className: className,
      transform: this.convertTransform(actor.transform),
      mark: mark
    };
    // add special properties
    switch (className) {
      case "assembler":
      case "constructor":
      case "foundry":
      case "manufacturer":
      case "oilRefinery":
      case "smelter":
        this.addCurrentRecipe(building, actor);
        this.addOverclockData(building, actor, saveGame);
        break;
      case "generatorBiomass":
      case "generatorCoal":
      case "generatorFuel":
      case "generatorGeoThermal":
      case "miner":
      case "oilPump":
        this.addOverclockData(building, actor, saveGame);
        break;
      case "conveyorPole":
        this.createConveyorPole(building, actor);
        break;
    }

    this.blueprint.buildings.push(building);
  }

  private createConveyorPole(building: Building, actor: Actor) {
    // mark of a conveyor pole depends on its height which we can get from the mPoleMesh
    const poleMesh = getProperty(actor, "mPoleMesh");
    if (poleMesh !== undefined) {
      switch (poleMesh.value.pathName) {
        case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_01_static.ConveyorPole_01_static":
          building.mark = 1;
          break;
        case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_02_static.ConveyorPole_02_static":
          building.mark = 2;
          break;
        case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_03_static.ConveyorPole_03_static":
          building.mark = 3;
          break;
        case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_04_static.ConveyorPole_04_static":
          building.mark = 4;
          break;
      }
    }
  }

  private addCurrentRecipe(building: Building, actor: Actor) {
    const currentRecipe = getProperty(actor, "mCurrentRecipe");
    if (currentRecipe !== undefined) {
      building.usedRecipe = currentRecipe.value.pathName;
    }
  }
  
  private addOverclockData(building: Building, actor: Actor, saveGame: SaveGame) {
    // TODO is this direcly the overclock rate?
    const currentPotential = getProperty(actor, "mCurrentPotential");
    if (currentPotential !== undefined) {
      building.overclockRate = currentPotential.value;
    }

    // Fetch the amount of power shards from the InventoryPotential
    const inventoryPotentialPath = getProperty(actor, "mInventoryPotential");
    if (inventoryPotentialPath !== undefined) {
      const inventoryPotential = findComponentByName(inventoryPotentialPath.value.pathName, saveGame);
      if (inventoryPotential !== undefined) {
        const inventoryStacks = getPropertyFromComponent(inventoryPotential, "mInventoryStacks");
        if (inventoryStacks !== undefined) {
          building.powerShards = 0;
          for (const stack of inventoryStacks.value.values) {
            const item = stack.properties[0];
            if (item.value.itemName === "/Game/FactoryGame/Resource/Environment/Crystal/Desc_CrystalShard.Desc_CrystalShard_C") {
              building.powerShards += item.value.properties[0].value; // TODO make sure to select the NumItems property
            }
          }
        }
      }
    }


  }

  private createConnection(actor: Actor, saveGame: SaveGame, className: string, mark?: number) {

  }

  private convertPathName(pathName: string): string {
    // TODO shorten name, maybe store in map, so we always generate the same names
    return pathName;
  }

  private convertTransform(transform: { rotation: number[]; translation: number[]; scale3d: number[]; }): Transform {
    const euler = new Euler().setFromQuaternion(new Quaternion(transform.rotation[0], transform.rotation[1], transform.rotation[2], transform.rotation[3]));
    return {
      position: {
        x: transform.translation[0] - this.origin.x,
        y: transform.translation[1] - this.origin.y,
        z: transform.translation[2] - this.origin.z
      },
      rotation: {
        x: rad2Deg(euler.x),
        y: rad2Deg(euler.y),
        z: rad2Deg(euler.z)
      }
    };
  }




}


/// helper functions ///

function isConnection(className: string) {
  return className === "conveyorBelt" || className === "conveyorLift" || className === "powerLine";
}

function rad2Deg(radians: number): number {
  return radians * (180 / Math.PI);
}

function deg2Rad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getProperty(
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
function getPropertyFromComponent(
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

function findActorByName(pathName: string, saveGame: SaveGame): Actor | undefined {
// TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < saveGame.actors.length; i++) {
      const element = saveGame.actors[i];
      if (element.pathName === pathName) {
        return element;
      }
    }
  return undefined;
}

function findComponentByName(pathName: string, saveGame: SaveGame): Component | undefined {
  // TODO might be worth optimizing using hashmap or the like
  for (let i = 0; i < saveGame.components.length; i++) {
    const element = saveGame.components[i];
    if (element.pathName === pathName) {
      return element;
    }
  }
  return undefined;
}