import { Mesh, Scene } from "three";
import GeometryFactory from "./GeometryFactory";
import {
  findActorByName,
  isConveyorBelt,
  isRailroadTrack
} from "@/helpers/entityHelper";
import { Actor } from "satisfactory-json";
import { Component } from "vue";
import MaterialFactory from "./MaterialFactory";

// manages the meshes displayed on the playground

export default class MeshManager {
  visibleMeshes: Mesh[] = [];
  invisibleMeshes: Mesh[] = [];
  meshByName: { [id: string]: { index: number; visibility: boolean } } = {};
  meshDictionaryDirty: boolean = false;

  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private refreshMeshDictionary() {
    this.meshDictionaryDirty = false;
    this.meshByName = {};
    for (let i = 0; i < this.visibleMeshes.length; i++) {
      const mesh = this.visibleMeshes[i];
      this.meshByName[mesh.userData.pathName] = { index: i, visibility: true };
    }
    for (let i = 0; i < this.invisibleMeshes.length; i++) {
      const mesh = this.invisibleMeshes[i];
      this.meshByName[mesh.userData.pathName] = { index: i, visibility: false };
    }
  }

  add(mesh: Mesh) {
    this.scene.add(mesh);
    this.visibleMeshes.push(mesh);
    this.meshDictionaryDirty = true;
  }

  // TODO use map to speed this up
  findMeshByName(pathName: string): Mesh | null {
    if (this.meshDictionaryDirty) {
      this.refreshMeshDictionary();
    }
    const mesh = this.meshByName[pathName];
    if (mesh === undefined) {
      return null;
    }
    if (mesh.visibility) {
      return this.visibleMeshes[mesh.index];
    } else {
      return this.invisibleMeshes[mesh.index];
    }
  }

  /**
   * to search in both lists, but also returns if the mesh was in the visible list
   */
  findMeshAndVisibilityByName(
    pathName: string
  ): { mesh: Mesh; visible: boolean } | null {
    if (this.meshDictionaryDirty) {
      this.refreshMeshDictionary();
    }
    const mesh = this.meshByName[pathName];
    if (mesh === undefined) {
      return null;
    }
    if (mesh.visibility) {
      return { mesh: this.visibleMeshes[mesh.index], visible: true };
    } else {
      return { mesh: this.invisibleMeshes[mesh.index], visible: true };
    }
  }

  // TODO are those still used?
  findVisibleMeshByName(pathName: string): Mesh | null {
    if (this.meshDictionaryDirty) {
      this.refreshMeshDictionary();
    }
    const mesh = this.meshByName[pathName];
    if (mesh === undefined) {
      return null;
    }
    if (mesh.visibility) {
      return this.visibleMeshes[mesh.index];
    } else {
      return null;
    }
  }

  findInvisibleMeshByName(pathName: string): Mesh | null {
    if (this.meshDictionaryDirty) {
      this.refreshMeshDictionary();
    }
    const mesh = this.meshByName[pathName];
    if (mesh === undefined) {
      return null;
    }
    if (mesh.visibility) {
      return null;
    } else {
      return this.invisibleMeshes[mesh.index];
    }
  }

  updateClassVisibility(val: { visible: boolean; name: string }[]) {
    for (var i = 0; i < val.length; i++) {
      const item = val[i];
      if (item.visible) {
        // make invisible objects visible again
        for (var j = this.invisibleMeshes.length - 1; j >= 0; j--) {
          const mesh = this.invisibleMeshes[j];

          if (
            findActorByName(mesh.userData.pathName)!.className === item.name
          ) {
            this.scene.add(mesh);
            this.invisibleMeshes.splice(j, 1);
            this.visibleMeshes.push(mesh);
          }
        }
      } else {
        for (var k = this.visibleMeshes.length - 1; k >= 0; k--) {
          const mesh = this.visibleMeshes[k];

          if (
            findActorByName(mesh.userData.pathName)!.className === item.name
          ) {
            this.scene.remove(mesh);
            this.visibleMeshes.splice(k, 1);
            this.invisibleMeshes.push(mesh);
          }
        }
      }
    }
    this.meshDictionaryDirty = true;
  }

  /**
   * Rebuilds all geometry if the showModel setting is changed
   */
  rebuildAllGeometry(geometryFactory: GeometryFactory) {
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.userData.pathName);
      // TODO should we dispose of the old models? or keep them in case the user changes the setting again
      if (actor === undefined) continue;

      geometryFactory
        .createGeometry(actor)
        .then(geometry => (mesh.geometry = geometry));
    }
  }

  rebuildConveyorBelts(geometryFactory: GeometryFactory) {
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.userData.pathName);
      if (actor === undefined) continue;
      // TODO here we should certainly dispose of the old conveyor belts
      mesh.geometry.dispose();
      if (isConveyorBelt(actor) || isRailroadTrack(actor)) {
        geometryFactory
          .createGeometry(actor)
          .then(geometry => (mesh.geometry = geometry));
      }
    }
  }

  deleteSelectedMeshes(payload: { actors: Actor[]; components: Component[] }) {
    // TODO delete geometry if not used by anything else?

    this.meshDictionaryDirty = true;
    for (const actor of payload.actors) {
      for (var i = this.visibleMeshes.length - 1; i >= 0; i--) {
        if (this.visibleMeshes[i].userData.pathName === actor.pathName) {
          this.scene.remove(this.visibleMeshes[i]);
          this.visibleMeshes.splice(i, 1);
          return;
        }
      }

      for (var j = this.invisibleMeshes.length - 1; j >= 0; j--) {
        if (this.invisibleMeshes[j].userData.pathName === actor.pathName) {
          this.scene.remove(this.invisibleMeshes[j]);
          this.invisibleMeshes.splice(j, 1);
          return;
        }
      }
    }
  }

  updateAllMaterials(materialFactory: MaterialFactory) {
    console.log("update");
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.userData.pathName);
      if (actor === undefined) continue;

      mesh.material = materialFactory.createMaterial(actor)!;
    }
  }

  dispose() {
    for (const mesh of this.visibleMeshes) {
      this.scene.remove(mesh);
    }
  }
}
