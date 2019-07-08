import { Mesh, Scene, Color, MeshMatcapMaterial, Material } from "three";
import InstancedMeshGroup from "./InstancedMeshGroup";
import GeometryFactory from "./GeometryFactory";
import { Actor } from "satisfactory-json";
import ColorFactory from "./ColorFactory";
import {
  isRailroadTrack,
  isConveyorBelt,
  isPowerLine
} from "@/helpers/entityHelper";

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
}

export class ThreeModelMesh implements ModelMesh {
  private mesh: Mesh;
  private material: MeshMatcapMaterial;
  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.material = mesh.material as MeshMatcapMaterial;
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
    this.material.color = (colorFactory.createMaterial(
      actor
    ) as MeshMatcapMaterial).color;
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
      this.material = this.mesh.material as MeshMatcapMaterial;
      // TODO what to do if the color changes while the actor is selected?
      this.mesh.material = colorFactory.getSelectedMaterial();
    } else {
      this.mesh.material = this.material;
    }
  }

  applyTransformToActor(actor: Actor): Actor {
    return applyMeshTransformToActor(this.mesh, actor);
  }
}

function applyMeshTransformToActor(mesh: Mesh, actor: Actor): Actor {
  // TODO need to clone, else change is not detected?
  // find more intelligent way
  var clone = Object.assign({}, actor);
  // switched to accord for coordinate system change!
  clone.transform.translation[1] = mesh.position.x;
  clone.transform.translation[0] = mesh.position.y;
  clone.transform.translation[2] = mesh.position.z;

  // TODO directly apply this rotation on the quaternion so we don't need to reverse it afterwards
  if (
    !isConveyorBelt(actor) &&
    !isRailroadTrack(actor) &&
    !isPowerLine(actor)
  ) {
    mesh.rotateZ(-1.5708); // -90 deg in radians
  } // TODO conveyor belt coordinates are given without rotation?

  clone.transform.rotation[0] = mesh.quaternion.x;
  clone.transform.rotation[1] = mesh.quaternion.y;
  clone.transform.rotation[2] = -mesh.quaternion.z;
  clone.transform.rotation[3] = mesh.quaternion.w;

  if (
    !isConveyorBelt(actor) &&
    !isRailroadTrack(actor) &&
    !isPowerLine(actor)
  ) {
    mesh.rotateZ(1.5708); // 90 deg in radians
  } // TODO conveyor belt coordinates are given without rotation?

  clone.transform.scale3d[0] = mesh.scale.x;
  clone.transform.scale3d[1] = mesh.scale.y;
  clone.transform.scale3d[2] = mesh.scale.z;
  return clone;
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
  }
  removeFromScene(scene: Scene): void {
    // TODO
  }

  rebuildGeometry(actor: Actor, geometryFactory: GeometryFactory): void {
    // TODO only rebuild once per InstancedMeshGroup
    geometryFactory
      .createGeometry(actor)
      .then(result => this.instancedMeshGroup.setGeometry(result.geometry));
  }

  rebuildColor(actor: Actor, colorFactory: ColorFactory): void {
    this.instancedMeshGroup.setColor(
      this.index,
      (colorFactory.createMaterial(actor) as MeshMatcapMaterial).color
    );
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
    this.instancedMeshGroup.setTransform(
      this.index,
      this.raycastMesh.position,
      this.raycastMesh.quaternion,
      this.raycastMesh.scale
    );

    return applyMeshTransformToActor(this.raycastMesh, actor);
  }
}
