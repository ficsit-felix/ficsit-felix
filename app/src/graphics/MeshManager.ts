import { Mesh, Scene } from "three";
import GeometryFactory from "./GeometryFactory";
import { findActorByName, isConveyorBelt } from "@/helpers/entityHelper";
import { Actor } from "satisfactory-json";
import { Component } from "vue";
import MaterialFactory from "./MaterialFactory";

// manages the meshes displayed on the playground

export default class MeshManager {
  visibleMeshes: Mesh[] = [];
  invisibleMeshes: Mesh[] = [];

  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  add(mesh: Mesh) {
    this.scene.add(mesh);
    this.visibleMeshes.push(mesh);
  }

  findMeshByName(pathName: string): Mesh | null {
    for (const mesh of this.visibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return mesh;
      }
    }
    for (const mesh of this.invisibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return mesh;
      }
    }
    return null;
  }

  /**
   * to search in both lists, but also returns if the mesh was in the visible list
   */
  findMeshAndVisibilityByName(
    pathName: string
  ): { mesh: Mesh; visible: boolean } | null {
    for (const mesh of this.visibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return { mesh, visible: true };
      }
    }
    for (const mesh of this.invisibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return { mesh, visible: false };
      }
    }
    return null;
  }

  findVisibleMeshByName(pathName: string): Mesh | null {
    for (const mesh of this.visibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return mesh;
      }
    }
    return null;
  }

  findInvisibleMeshByName(pathName: string): Mesh | null {
    for (const mesh of this.invisibleMeshes) {
      if (mesh.userData.pathName === pathName) {
        return mesh;
      }
    }
    return null;
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
      if (isConveyorBelt(actor)) {
        geometryFactory
          .createGeometry(actor)
          .then(geometry => (mesh.geometry = geometry));
      }
    }
  }

  deleteSelectedMeshes(payload: { actors: Actor[]; components: Component[] }) {
    // TODO delete geometry if not used by anything else?

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
