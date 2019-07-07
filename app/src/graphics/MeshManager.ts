import {
  Mesh,
  Scene,
  Color,
  Material,
  UniformsLib,
  ShaderChunk,
  BufferGeometry,
  MeshMatcapMaterial,
  Object3D
} from "three";
import GeometryFactory from "./GeometryFactory";
import {
  findActorByName,
  isConveyorBelt,
  isRailroadTrack
} from "@/helpers/entityHelper";
import { Actor } from "satisfactory-json";
import { Component } from "vue";
import { MeshResult } from "./MeshFactory";
import InstancedMeshGroup from "./InstancedMeshGroup";
import { ModelMesh, ThreeModelMesh, InstancedModelMesh } from "./ModelMesh";
import ColorFactory from "./ColorFactory";

/**
 * manages the meshes displayed on the playground
 */
export default class MeshManager {
  visibleMeshes: ModelMesh[] = [];
  invisibleMeshes: ModelMesh[] = [];

  raycastActiveMeshes: Mesh[] = [];
  raycastInactiveMeshes: Mesh[] = [];
  meshByName: {
    [id: string]: {
      index: number;
      visibility: boolean;
    };
  } = {};
  meshDictionaryDirty: boolean = false;

  instancedMeshGroups: { [id: string]: InstancedMeshGroup } = {};

  scene: Scene;
  material: Material;

  constructor(scene: Scene, material: Material) {
    this.scene = scene;
    this.material = material;
  }

  private refreshMeshDictionary() {
    this.meshDictionaryDirty = false;
    this.meshByName = {};
    for (let i = 0; i < this.visibleMeshes.length; i++) {
      const mesh = this.visibleMeshes[i];
      this.meshByName[mesh.getPathName()] = { index: i, visibility: true };
    }
    for (let i = 0; i < this.invisibleMeshes.length; i++) {
      const mesh = this.invisibleMeshes[i];
      this.meshByName[mesh.getPathName()] = { index: i, visibility: false };
    }
  }

  /**
   * Adds a new mesh to be handled by the MeshManager
   * @param result the MeshResult created by the MeshFactory
   */
  add(result: MeshResult) {
    let modelMesh;
    if (result.instance === undefined) {
      modelMesh = new ThreeModelMesh(result.mesh);
      this.visibleMeshes.push(modelMesh);
    } else {
      // Add to the corresponding MeshInstance
      if (this.instancedMeshGroups[result.instance] === undefined) {
        this.instancedMeshGroups[result.instance] = new InstancedMeshGroup(
          this.material,
          result.mesh.geometry as BufferGeometry
        );
      }

      const index = this.instancedMeshGroups[result.instance].add({
        pathName: result.mesh.userData.pathName,
        visible: true, // TODO what about starting with classes invisible?
        position: result.mesh.position,
        quat: result.mesh.quaternion,
        scale: result.mesh.scale,
        color: (result.mesh.material as MeshMatcapMaterial).color
      });
      // store the instance index into the mesh
      result.mesh.userData.instance = result.instance;
      result.mesh.userData.index = index;
      modelMesh = new InstancedModelMesh(
        this.instancedMeshGroups[result.instance],
        index,
        result.mesh
      );

      this.visibleMeshes.push(modelMesh);
    }

    modelMesh.addToScene(this.scene);

    // use the meshes for raycasting
    result.mesh.updateMatrixWorld(true);
    this.raycastActiveMeshes.push(result.mesh);

    // need to rebuild the mesh dictionary the next time we use it
    this.meshDictionaryDirty = true;
  }

  /**
   * Builds the InstancedMeshGroups
   *
   * Should be called after all actors are added to the scene
   */
  buildInstancedMeshGroups() {
    // calculate matrixes for all meshes so that we can do raycasting

    console.log("BUILD MESH INSTANCES");
    console.log(this.instancedMeshGroups);
    for (const key in this.instancedMeshGroups) {
      console.log("build instanced mesh " + key);
      this.scene.add(this.instancedMeshGroups[
        key
      ].buildInstancedMesh() as Object3D);
    }
  }

  findMeshByName(pathName: string): ModelMesh | null {
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
  ): { mesh: ModelMesh; visible: boolean } | null {
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
  findVisibleMeshByName(pathName: string): ModelMesh | null {
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

  findInvisibleMeshByName(pathName: string): ModelMesh | null {
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

          if (findActorByName(mesh.getPathName())!.className === item.name) {
            mesh.addToScene(this.scene);
            this.invisibleMeshes.splice(j, 1);
            this.visibleMeshes.push(mesh);
          }
        }
      } else {
        for (var k = this.visibleMeshes.length - 1; k >= 0; k--) {
          const mesh = this.visibleMeshes[k];

          if (findActorByName(mesh.getPathName())!.className === item.name) {
            mesh.addToScene(this.scene);
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
      const actor = findActorByName(mesh.getPathName());
      // TODO should we dispose of the old models? or keep them in case the user changes the setting again
      if (actor === undefined) continue;

      mesh.rebuildGeometry(actor, geometryFactory);
    }
  }

  rebuildConveyorBelts(geometryFactory: GeometryFactory) {
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.getPathName());
      if (actor === undefined) continue;
      // TODO here we should certainly dispose of the old conveyor belts
      //mesh.geometry.dispose();

      if (isConveyorBelt(actor) || isRailroadTrack(actor)) {
        mesh.rebuildGeometry(actor, geometryFactory);
      }
    }
  }

  deleteSelectedMeshes(payload: { actors: Actor[]; components: Component[] }) {
    // TODO delete geometry if not used by anything else?

    this.meshDictionaryDirty = true;
    for (const actor of payload.actors) {
      for (var i = this.visibleMeshes.length - 1; i >= 0; i--) {
        if (this.visibleMeshes[i].getPathName() === actor.pathName) {
          this.visibleMeshes[i].removeFromScene(this.scene);
          this.visibleMeshes.splice(i, 1);
          break;
        }
      }

      for (var j = this.invisibleMeshes.length - 1; j >= 0; j--) {
        if (this.invisibleMeshes[j].getPathName() === actor.pathName) {
          this.invisibleMeshes[j].removeFromScene(this.scene);
          this.invisibleMeshes.splice(j, 1);
          break;
        }
      }
    }
  }

  updateAllMaterials(colorFactory: ColorFactory) {
    console.log("updateAllMaterials");
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.getPathName());
      if (actor === undefined) continue;
      mesh.rebuildColor(actor, colorFactory);
    }
  }

  dispose() {
    for (const mesh of this.visibleMeshes) {
      mesh.dispose();
    }
    for (const mesh of this.invisibleMeshes) {
      mesh.dispose();
    }
    for (const key in this.instancedMeshGroups) {
      this.instancedMeshGroups[key].dispose();
      /*      if (this.instancedMeshGroups[key].instancedMesh !== undefined) {
        this.scene.remove(this.instancedMeshGroups[key].instancedMesh!);
      }*/
    }
  }
}
