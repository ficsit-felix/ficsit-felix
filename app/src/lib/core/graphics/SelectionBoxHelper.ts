import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Euler,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Vector3
} from 'three';

/**
 * Box3Helper, but modified to be movable, rotatable and scalable using TransformControls to modify multiple selected objects at once
 */
export class SelectionBoxHelper extends LineSegments {
  private box: Box3;

  public prevPosition: Vector3;
  public prevRotation: Euler;
  public prevScale: Vector3;

  constructor(box: Box3, color = 0xffff00) {
    const indices = new Uint16Array([
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      0,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      4,
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7
    ]);

    const positions = [
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1
    ];

    const geometry = new BufferGeometry();

    geometry.setIndex(new BufferAttribute(indices, 1));

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    super(geometry, new LineBasicMaterial({ color: color, toneMapped: false }));

    this.box = box;

    //this.type = 'Box3Helper';

    this.geometry.computeBoundingSphere();
    this.prevPosition = new Vector3();
    this.prevRotation = new Euler();
    this.prevScale = new Vector3();
  }

  // Update the transform of this Object3D when a new selection is applied
  updatePositionRotationScale() {
    console.log('UPDATE POS');
    const box = this.box;
    if (box.isEmpty()) return;

    box.getCenter(this.position);
    this.rotation.set(0, 0, 0);

    box.getSize(this.scale);
    this.scale.multiplyScalar(0.5);

    // Remember this transform to be able to compute change
    this.prevPosition.copy(this.position);
    this.prevRotation.copy(this.rotation);
    this.prevScale.copy(this.scale);
  }

  updateMatrixWorld(force: boolean) {
    // console.log('updateMatrixWorld', this.position);
    const box = this.box;

    if (box.isEmpty()) return;

    /*box.getCenter(this.position);

    box.getSize(this.scale);*/

    // this.scale.multiplyScalar(0.5);

    super.updateMatrixWorld(force);
  }
}
