import { BufferGeometry, Color, Material, Quaternion, Vector3 } from 'three';

// patch the THREE instance
import * as THREE from 'three';
import index from '@bitowl/three-instanced-mesh';
const ThreeInstancedMesh = index(THREE);

const farAway = new Vector3(1000000000, 0, 0);

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
  public instancedMesh?: typeof ThreeInstancedMesh;
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

  public buildInstancedMesh(): typeof ThreeInstancedMesh {
    this.instancedMesh = new ThreeInstancedMesh(
      this.geometry,
      this.material,
      this.nodes.length, // instance count
      true, // is it dynamic
      true, // does it have color
      false // uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
    );

    this.fillAttributes();

    return this.instancedMesh;
  }

  public setTransform(
    index: number,
    position: Vector3,
    quaternion: Quaternion,
    scale: Vector3
  ) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.nodes[index].position = position;
    this.nodes[index].quat = quaternion;
    this.nodes[index].scale = scale;
    if (this.nodes[index].visible) {
      this.instancedMesh.setPositionAt(index, position);
    } else {
      this.instancedMesh.setPositionAt(index, farAway);
    }
    this.instancedMesh.setQuaternionAt(index, quaternion);
    this.instancedMesh.setScaleAt(index, scale);
    this.instancedMesh.needsUpdate('position');
    this.instancedMesh.needsUpdate('quaternion');
    this.instancedMesh.needsUpdate('scale');
  }

  public setVisible(index: number, visible: boolean) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.nodes[index].visible = visible;
    if (visible === true) {
      this.instancedMesh.setPositionAt(index, this.nodes[index].position);
    } else {
      this.instancedMesh.setPositionAt(index, farAway);
    }
    this.instancedMesh.needsUpdate('position');
  }

  public setGeometry(geometry: BufferGeometry) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.instancedMesh.geometry = geometry;
  }

  public setColor(index: number, color: Color) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.instancedMesh.setColorAt(index, color);
    this.instancedMesh.needsUpdate('colors');
  }

  // The InstancedMesh needs to be rebuild after the number of nodes is changed
  // This currently only supports adding new instances. While deleting the instances are only made invisible
  public rebuild() {
    this.instancedMesh!.numInstances = this.nodes.length;
    this.fillAttributes();
  }

  private fillAttributes() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      this.instancedMesh!.setQuaternionAt(i, node.quat);
      if (node.visible === true) {
        this.instancedMesh!.setPositionAt(i, node.position);
      } else {
        this.instancedMesh!.setPositionAt(i, farAway);
      }

      this.instancedMesh!.setScaleAt(i, node.scale);
      this.instancedMesh!.setColorAt(i, node.color);
    }
  }

  public dispose() {
    // TODO
  }
}
