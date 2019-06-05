import { MOUSE, Raycaster } from "three";

var SelectControls = function(scene, camera, domElement, callback) {
  this.callback = null;
  this.disabled = false;

  this.bindCallback = function(callback) {
    this.callback = callback;
  };

  // private
  var mouse = {
    x: 0,
    y: 0
  };

  var raycaster = new Raycaster();

  var scope = this;
  this.callback = callback;

  function onMouseMove(event) {
    event.preventDefault();
    var rect = domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function onMouseDown(event) {
    if (scope.disabled) {
      return;
    }

    if (event.button == MOUSE.LEFT) {
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.children, true);
      // recursive, so that we also get intersections with the other parts of a conveyor lift

      for (const intersection of intersects) {
        var object = intersection.object;

        if (object.type === "TransformControlsPlane") {
          // ignore the plane of the TransformHelper
          continue;
          // we hit the plane of the transform gizmo, deselect and then try the raycast again
          /*scope.callback.select([]);
          // TODO find a better way to fix this?
          setTimeout(() => {
            onMouseDown(event);
          }, 100);
          return;*/
        }

        while (
          object !== null &&
          object.userData.id === undefined &&
          object.parent !== undefined
        ) {
          // the id is only defined on the topmost object
          object = object.parent;
        }
        // object.material.emissive.setHex(0xff00ff);
        if (object !== null && object.userData.id !== undefined) {
          scope.callback.select([object.userData.pathName]);
        } else {
          scope.callback.select([]);
        }
        return;
      }

      scope.callback.select([]);
    }
  }

  domElement.addEventListener("mousedown", onMouseDown, false);
  domElement.addEventListener("mousemove", onMouseMove, false);

  this.destroy = () => {
    domElement.removeEventListener("mousedown", onMouseDown);
    domElement.removeEventListener("mousemove", onMouseMove);
  };
};

export { SelectControls };
