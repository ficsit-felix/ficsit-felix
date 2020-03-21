import {
  Mesh,
  Scene,
  Material,
  BufferGeometry,
  MeshMatcapMaterial,
  Object3D
} from 'three';
import GeometryFactory from './GeometryFactory';
import { findActorByName, isSpline } from '@/helpers/entityHelper';
import { Actor } from 'satisfactory-json';
import { Component } from 'vue';
import { MeshResult } from './MeshFactory';
import InstancedMeshGroup from './InstancedMeshGroup';
import { ModelMesh, ThreeModelMesh, InstancedModelMesh } from './ModelMesh';
import ColorFactory from './ColorFactory';

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
   * @param visible wheter this mesh should currently be visible
   */
  add(result: MeshResult, visible: boolean) {
    let modelMesh;
    if (result.instance === undefined) {
      modelMesh = new ThreeModelMesh(result.mesh);
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
        visible: visible,
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
    }

    // use the meshes for raycasting
    result.mesh.updateMatrixWorld(true);
    if (visible) {
      modelMesh.addToScene(this.scene);
      this.visibleMeshes.push(modelMesh);
      this.raycastActiveMeshes.push(modelMesh.getRaycastMesh());
    } else {
      this.invisibleMeshes.push(modelMesh);
      this.raycastInactiveMeshes.push(modelMesh.getRaycastMesh());
    }

    // need to rebuild the mesh dictionary the next time we use it
    this.meshDictionaryDirty = true;
  }

  /**
   * Builds the InstancedMeshGroups
   *
   * Should be called after all actors are added to the scene
   */
  buildInstancedMeshGroups() {
    for (const key in this.instancedMeshGroups) {
      this.scene.add(
        this.instancedMeshGroups[key].buildInstancedMesh() as Object3D
      );
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
            this.raycastActiveMeshes.push(this.raycastInactiveMeshes[j]);
            this.raycastInactiveMeshes.splice(j, 1);
          }
        }
      } else {
        for (var k = this.visibleMeshes.length - 1; k >= 0; k--) {
          const mesh = this.visibleMeshes[k];

          if (findActorByName(mesh.getPathName())!.className === item.name) {
            mesh.removeFromScene(this.scene);
            this.visibleMeshes.splice(k, 1);
            this.invisibleMeshes.push(mesh);
            this.raycastInactiveMeshes.push(this.raycastActiveMeshes[k]);
            this.raycastActiveMeshes.splice(k, 1);
          }
        }
      }
    }
    this.meshDictionaryDirty = true;
  }

  rebuildConveyorBelts(geometryFactory: GeometryFactory) {
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.getPathName());
      if (actor === undefined) continue;
      // TODO here we should certainly dispose of the old conveyor belts
      //mesh.geometry.dispose();

      if (isSpline(actor)) {
        mesh.rebuildGeometry(actor, geometryFactory);
      }
    }
  }

  deleteSelectedMeshes(payload: { actors: Actor[]; components: Component[] }) {
    // TODO delete geometry if not used by anything else?

    this.meshDictionaryDirty = true;
    for (const actor of payload.actors) {
      let found = false;
      for (var i = this.visibleMeshes.length - 1; i >= 0; i--) {
        if (this.visibleMeshes[i].getPathName() === actor.pathName) {
          this.visibleMeshes[i].removeFromScene(this.scene);
          this.visibleMeshes.splice(i, 1);
          this.raycastActiveMeshes.splice(i, 1);
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }

      for (var j = this.invisibleMeshes.length - 1; j >= 0; j--) {
        if (this.invisibleMeshes[j].getPathName() === actor.pathName) {
          this.invisibleMeshes[j].removeFromScene(this.scene);
          this.invisibleMeshes.splice(j, 1);
          this.raycastInactiveMeshes.splice(j, 1);
          break;
        }
      }
    }
  }

  updateAllMaterials(colorFactory: ColorFactory) {
    console.log('updateAllMaterials');
    for (const mesh of this.visibleMeshes.concat(this.invisibleMeshes)) {
      const actor = findActorByName(mesh.getPathName());
      if (actor === undefined) continue;
      mesh.rebuildColor(actor, colorFactory);
    }
  }

  dispose(scene: Scene) {
    for (const mesh of this.visibleMeshes) {
      mesh.removeFromScene(scene);
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
