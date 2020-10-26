import {
  Box3,
  Box3Helper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Scene
} from 'three';
import { SelectionBoxHelper } from './SelectionBoxHelper';

/**
 * Gizmo that shows the bounds of all currently selected actors
 */
export class SelectionBoundsBox {
  private scene: Scene;
  private isVisible: boolean = false;
  private box: Box3;
  public helper: SelectionBoxHelper;
  public pivotObject: Object3D;
  constructor(scene: Scene) {
    this.scene = scene;
    this.box = new Box3();
    this.helper = new SelectionBoxHelper(this.box);
    this.pivotObject = new Object3D();
    this.scene.add(this.pivotObject); // Needs to be added to the scene to be usable for the transform control to attach to
  }

  setVisible(visible: boolean) {
    if (visible != this.isVisible) {
      this.isVisible = visible;
      if (visible) {
        this.scene.add(this.helper);
      } else {
        this.scene.remove(this.helper);
      }
    }
  }

  setBounds(objects: Object3D[]) {
    this.box.makeEmpty();
    objects.forEach(obj => {
      this.box.expandByObject(obj);
    });

    this.box.getCenter(this.pivotObject.position);
    this.helper.updatePositionRotationScale();
  }
}
