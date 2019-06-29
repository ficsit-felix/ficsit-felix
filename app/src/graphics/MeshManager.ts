import { Mesh, Scene, Color, Material, UniformsLib, ShaderChunk } from "three";
import GeometryFactory from "./GeometryFactory";
import {
  findActorByName,
  isConveyorBelt,
  isRailroadTrack
} from "@/helpers/entityHelper";
import { Actor } from "satisfactory-json";
import { Component } from "vue";
import MaterialFactory from "./MaterialFactory";
// patch the THREE instance
import * as THREE from "three";
var InstancedMesh = require("three-instanced-mesh")(THREE);

/**
 * manages the meshes displayed on the playground
 */
export default class MeshManager {
  visibleMeshes: Mesh[] = [];
  invisibleMeshes: Mesh[] = [];
  meshByName: { [id: string]: { index: number; visibility: boolean } } = {};
  meshDictionaryDirty: boolean = false;

  scene: Scene;

  cluster: any;

  constructor(scene: Scene, material: Material) {
    this.scene = scene;

    for (let x = 0; x < 100; x++) {
      //geometry to be instanced
      var boxGeometry = new THREE.BoxBufferGeometry(2, 2, 2, 1, 1, 1);

      //material that the geometry will use
      var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });

      //the instance group
      this.cluster = new InstancedMesh(
        boxGeometry, //this is the same
        material,
        10000, //instance count
        true, //is it dynamic
        true, //does it have color
        false //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
      );

      var _v3 = new THREE.Vector3();
      var _q = new THREE.Quaternion();

      for (var i = 0; i < 10000; i++) {
        this.cluster.setQuaternionAt(i, _q);
        this.cluster.setPositionAt(
          i,
          _v3.set(
            Math.random() * 100000,
            Math.random() * 100000,
            Math.random() * 10000
          )
        );
        this.cluster.setScaleAt(
          i,
          _v3.set(
            Math.random() * 100 + 10,
            Math.random() * 100 + 10,
            Math.random() * 100 + 10
          )
        );
        this.cluster.setColorAt(i, new Color(Math.random() * 0xffffff));
      }

      scene.add(this.cluster);
    }
  }

  private refreshMeshDictionary() {
    console.log("refresh");
    // tmp
    for (var i = 0; i < 10000; i++) {
      this.cluster.setColorAt(i, new Color(Math.random() * 0xffffff));
    }
    this.cluster.needsUpdate("colors");
    // end tmp

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

    this.scene.remove(this.cluster);
  }
}
