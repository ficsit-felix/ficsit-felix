import {
  BufferGeometry,
  Color,
  InstancedMesh,
  Material,
  Matrix4,
  Quaternion,
  Vector3,
} from 'three';

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
  public instancedMesh?: InstancedMesh;
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

  public buildInstancedMesh(): InstancedMesh {
    this.instancedMesh = new InstancedMesh(
      this.geometry,
      this.material,
      this.nodes.length // instance count
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

    // Calculate matrix for instance.
    const matrix = new Matrix4();
    matrix.makeRotationFromQuaternion(quaternion);

    if (this.nodes[index].visible) {
      matrix.setPosition(position);
    } else {
      matrix.setPosition(farAway);
    }
    matrix.scale(scale);
    this.instancedMesh.setMatrixAt(index, matrix);
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  public setVisible(index: number, visible: boolean) {
    if (this.instancedMesh === undefined) {
      return;
    }
    this.nodes[index].visible = visible;
    const matrix = new Matrix4();
    this.instancedMesh.getMatrixAt(index, matrix);
    if (visible === true) {
      matrix.setPosition(this.nodes[index].position);
    } else {
      matrix.setPosition(farAway);
    }
    this.instancedMesh.setMatrixAt(index, matrix);
    this.instancedMesh.instanceMatrix.needsUpdate = true;
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
    this.instancedMesh.instanceColor!.needsUpdate = true;
  }

  // The InstancedMesh needs to be rebuild after the number of nodes is changed
  // This currently only supports adding new instances. While deleting the instances are only made invisible
  public rebuild() {
    // FIXME with threes instancedMesh it cannot be creater than the initial count, so the instanced mesh needs to be recreated?
    this.instancedMesh!.count = this.nodes.length;
    this.fillAttributes();
  }

  private fillAttributes() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const matrix = new Matrix4();
      matrix.makeRotationFromQuaternion(node.quat);
      if (node.visible === true) {
        matrix.setPosition(node.position);
      } else {
        matrix.setPosition(farAway);
      }
      matrix.scale(node.scale);
      this.instancedMesh!.setMatrixAt(i, matrix);
      this.instancedMesh!.setColorAt(i, node.color);
    }
    this.instancedMesh!.instanceMatrix.needsUpdate = true;
    this.instancedMesh!.instanceColor!.needsUpdate = true;
  }

  public dispose() {
    this.instancedMesh?.dispose();
  }
}
