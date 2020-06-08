import { MOUSE, Raycaster } from 'three';

// TODO remove the explicit playground parameter just to get the meshManager
let SelectControls = function(scene, camera, domElement, callback, playground) {
  this.callback = null;
  this.disabled = false;

  this.bindCallback = function(callback) {
    this.callback = callback;
  };

  // private
  let mouse = {
    x: 0,
    y: 0
  };

  let raycaster = new Raycaster();

  let scope = this;
  this.callback = callback;

  function onMouseMove(event) {
    event.preventDefault();
    let rect = domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onMouseDown(event) {
    if (scope.disabled) {
      return;
    }

    if (event.button == MOUSE.LEFT) {
      raycaster.setFromCamera(mouse, camera.obj);
      let intersects = raycaster.intersectObjects(
        playground.meshManager.raycastActiveMeshes,
        true
      );
      // recursive, so that we also get intersections with the other parts of a conveyor lift

      for (const intersection of intersects) {
        let object = intersection.object;

        if (object.type === 'TransformControlsPlane') {
          // ignore the plane of the TransformHelper
          continue;
        }

        while (
          object !== null &&
          object.userData.pathName === undefined &&
          object.parent !== undefined
        ) {
          // the id is only defined on the topmost object
          object = object.parent;
        }
        // object.material.emissive.setHex(0xff00ff);
        if (object !== null && object.userData.pathName !== undefined) {
          scope.callback.select([object.userData.pathName]);
        } else {
          scope.callback.select([]);
        }
        return;
      }

      scope.callback.select([]);
    }
  }

  domElement.addEventListener('mousedown', onMouseDown, false);
  domElement.addEventListener('mousemove', onMouseMove, false);

  this.destroy = () => {
    domElement.removeEventListener('mousedown', onMouseDown);
    domElement.removeEventListener('mousemove', onMouseMove);
  };
};

export { SelectControls };
