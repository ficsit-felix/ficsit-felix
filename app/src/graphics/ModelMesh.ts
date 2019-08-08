import { Mesh, Scene, Color, MeshMatcapMaterial, Material } from 'three';
import InstancedMeshGroup from './InstancedMeshGroup';
import GeometryFactory from './GeometryFactory';
import { Actor } from 'satisfactory-json';
import ColorFactory from './ColorFactory';
import {
  applyMeshTransformToActor,
  updateActorMeshTransform
} from '@/helpers/meshHelper';

/**
 * Interface for Meshes
 * This can be either a wrapper around a usual THREE.Mesh or points to a node in an InstancedMesh
 */
export interface ModelMesh {
  getPathName(): string;
  getRaycastMesh(): Mesh;

  // TODO replace with setVisible?
  addToScene(scene: Scene): void;
  removeFromScene(scene: Scene): void;

  rebuildGeometry(actor: Actor, geometryFactory: GeometryFactory): void;
  rebuildColor(actor: Actor, colorFactory: ColorFactory): void;

  dispose(): void;
  setSelected(
    selected: boolean,
    colorFactory: ColorFactory,
    scene: Scene
  ): void;
  applyTransformToActor(actor: Actor): Actor;
  applyTransform(actor: Actor): void;
}

export class ThreeModelMesh implements ModelMesh {
  private mesh: Mesh;
  private material: MeshMatcapMaterial;
  constructor(mesh: Mesh) {
    this.mesh = mesh;
    // need to make a clone of the material as we change its color in rebuildColor()
    this.material = (mesh.material as MeshMatcapMaterial).clone();
    this.mesh.material = this.material;
    for (const child of this.mesh.children) {
      if (child instanceof Mesh) {
        child.material = this.material;
      }
    }
  }

  getPathName(): string {
    return this.mesh.userData.pathName;
  }

  getRaycastMesh(): Mesh {
    return this.mesh;
  }

  addToScene(scene: Scene): void {
    scene.add(this.mesh);
  }
  removeFromScene(scene: Scene): void {
    scene.remove(this.mesh);
  }

  rebuildGeometry(actor: Actor, geometryFactory: GeometryFactory): void {
    geometryFactory
      .createGeometry(actor)
      .then(result => (this.mesh.geometry = result.geometry));
  }

  rebuildColor(actor: Actor, colorFactory: ColorFactory): void {
    this.material.color = colorFactory.getColor(actor);
  }

  dispose(): void {
    // TODO remove from scene if visible
  }

  setSelected(
    selected: boolean,
    colorFactory: ColorFactory,
    scene: Scene
  ): void {
    if (selected) {
      this.mesh.material = colorFactory.getSelectedMaterial();
      for (const child of this.mesh.children) {
        if (child instanceof Mesh) {
          child.material = colorFactory.getSelectedMaterial();
        }
      }
    } else {
      this.mesh.material = this.material;
      for (const child of this.mesh.children) {
        if (child instanceof Mesh) {
          child.material = this.material;
        }
      }
    }
  }

  applyTransformToActor(actor: Actor): Actor {
    return applyMeshTransformToActor(this.mesh, actor);
  }

  applyTransform(actor: Actor) {
    updateActorMeshTransform(this.mesh, actor);
  }
}

export class InstancedModelMesh implements ModelMesh {
  private instancedMeshGroup: InstancedMeshGroup;
  private index: number;
  private raycastMesh: Mesh;
  constructor(
    instancedMeshGroup: InstancedMeshGroup,
    index: number,
    raycastMesh: Mesh
  ) {
    this.instancedMeshGroup = instancedMeshGroup;
    this.index = index;
    this.raycastMesh = raycastMesh;
  }

  getPathName(): string {
    return this.raycastMesh.userData.pathName;
  }

  getRaycastMesh(): Mesh {
    return this.raycastMesh;
  }

  addToScene(scene: Scene): void {
    // TODO
    this.instancedMeshGroup.setVisible(this.index, true);
  }
  removeFromScene(scene: Scene): void {
    scene.remove(this.raycastMesh);
    this.instancedMeshGroup.setVisible(this.index, false);
  }

  rebuildGeometry(actor: Actor, geometryFactory: GeometryFactory): void {
    // TODO only rebuild once per InstancedMeshGroup
    geometryFactory
      .createGeometry(actor)
      .then(result => this.instancedMeshGroup.setGeometry(result.geometry));
  }

  rebuildColor(actor: Actor, colorFactory: ColorFactory): void {
    this.instancedMeshGroup.setColor(this.index, colorFactory.getColor(actor));
  }

  dispose(): void {
    // TODO
  }

  setSelected(
    selected: boolean,
    colorFactory: ColorFactory,
    scene: Scene
  ): void {
    // TODO change color
    if (selected) {
      this.raycastMesh.material = colorFactory.getSelectedMaterial(); // TODO set this material on creation already as the raycastMesh will only be visible if this ModelMesh is selected
      scene.add(this.raycastMesh);
      // TODO correctly remove the raycast mesh from the scene when this ModelMesh is selected on dispose
    } else {
      scene.remove(this.raycastMesh);
    }
    this.instancedMeshGroup.setVisible(this.index, !selected);
  }

  applyTransformToActor(actor: Actor): Actor {
    // apply the changes to the instanced mesh group as well
    /*this.instancedMeshGroup.setTransform(
      this.index,
      this.raycastMesh.position,
      this.raycastMesh.quaternion,
      this.raycastMesh.scale
    );*/

    return applyMeshTransformToActor(this.raycastMesh, actor);
  }

  applyTransform(actor: Actor) {
    updateActorMeshTransform(this.raycastMesh, actor);
    // apply the changes to the instanced mesh group as well
    this.instancedMeshGroup.setTransform(
      this.index,
      this.raycastMesh.position,
      this.raycastMesh.quaternion,
      this.raycastMesh.scale
    );
  }
}
