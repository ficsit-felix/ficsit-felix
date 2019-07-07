import {
  Material,
  UniformsLib,
  Geometry,
  Color,
  Vector3,
  Quaternion,
  BufferGeometry
} from "three";

// patch the THREE instance
import * as THREE from "three";
import index from "three-instanced-mesh";
const InstancedMesh = index(THREE);

export interface InstancedMeshElement {
  pathName: string;
  visible: boolean;
  position: Vector3;
  quat: Quaternion;
  scale: Vector3;
  color: Color;
}

/**
 * Wrapper around InstancedMesh that handles passing in the arguments
 *
 * Defines a group of instances that use the same geometry
 */
export default class InstancedMeshGroup {
  private material: Material;
  public instancedMesh?: typeof InstancedMesh;
  private geometry: BufferGeometry;
  public nodes: InstancedMeshElement[] = [];

  constructor(material: Material, geometry: BufferGeometry) {
    this.material = material;
    this.geometry = geometry;
  }

  public add(node: InstancedMeshElement): number {
    const index = this.nodes.length;
    this.nodes.push(node);
    return index;
  }

  public buildInstancedMesh(): typeof InstancedMesh {
    this.instancedMesh = new InstancedMesh(
      this.geometry,
      this.material,
      this.nodes.length, // instance count
      true, // is it dynamic
      true, // does it have color
      false // uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );

    var _v3 = new Vector3();
    var _q = new Quaternion();

    for (var i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      this.instancedMesh.setQuaternionAt(i, node.quat);
      this.instancedMesh.setPositionAt(i, node.position);
      this.instancedMesh.setScaleAt(i, node.scale);
      this.instancedMesh.setColorAt(i, node.color);
    }

    return this.instancedMesh;
  }

  public setTransform(index: number, position: Vector3, quaternion: Quaternion, scale: Vector3) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.instancedMesh.setPositionAt(index, position);
    this.instancedMesh.setQuaternionAt(index, quaternion);
    this.instancedMesh.setScaleAt(index, scale);
    this.instancedMesh.needsUpdate("position");
    this.instancedMesh.needsUpdate("quaternion");
    this.instancedMesh.needsUpdate("scale");

  }
  
  public dispose() {
    // TODO
  }
}
