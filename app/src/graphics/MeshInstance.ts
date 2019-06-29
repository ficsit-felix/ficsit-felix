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

export interface MeshInstanceNode {
  position: Vector3;
  quat: Quaternion;
  scale: Vector3;
  color: Color;
}

// patch matcap shaders
// TODO do this only once?

export default class MeshInstance {
  private material: Material;
  public instancedMesh?: typeof InstancedMesh;
  private geometry: BufferGeometry;
  private nodes: MeshInstanceNode[] = [];

  constructor(material: Material, geometry: BufferGeometry) {
    this.material = material;
    this.geometry = geometry;
  }

  public add(node: MeshInstanceNode): number {
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
}
