import { SelectionBox } from "@/js/SelectionBox";
import { SelectionHelper } from "@/js/SelectionHelper";
import * as THREE from "three";
import { MOUSE } from "three";

var BoxSelectControls = function(
  scene,
  camera,
  domElement,
  callback // renderer object
) {
  this.disabled = true;
  this.isDown = false;

  var selectionBox = new SelectionBox(camera, scene);
  var helper = new SelectionHelper(selectionBox, domElement, "selectBox", this);
  var scope = this;

  function onMouseDown(event) {
    if (scope.disabled) {
      return;
    }
    /*for (var item of selectionBox.collection) {
      item.material.emissive = new THREE.Color(0x000000);
    }*/

    if (event.button !== MOUSE.LEFT) {
      return;
    }
    scope.isDown = true;
    var rect = domElement.getBoundingClientRect();
    selectionBox.startPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
      0.5
    );
  }

  function onMouseMove(event) {
    if (scope.disabled) {
      return;
    }
    if (scope.isDown) {
      /*for (var i = 0; i < selectionBox.collection.length; i++) {
        selectionBox.collection[i].material.emissive = new THREE.Color(
          0x000000
        );
      }*/
      var rect = domElement.getBoundingClientRect();
      selectionBox.endPoint.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
        0.5
      );
      // var allSelected = selectionBox.select();
      /*      for (var j = 0; j < allSelected.length; j++) { asdf
        allSelected[j].material.emissive = new THREE.Color(0x0000ff);
      }*/
    }
  }

  function onMouseUp(event) {
    if (scope.disabled) {
      return;
    }
    if (!scope.isDown) {
      return;
    }
    scope.isDown = false;
    var rect = domElement.getBoundingClientRect();
    selectionBox.endPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
      0.5
    );
    var allSelected = selectionBox.select();
    var selectedPathNames = [];
    for (const mesh of allSelected) {
      if (mesh.userData !== undefined && mesh.userData.pathName !== undefined) {
        selectedPathNames.push(mesh.userData.pathName);
      }
    }
    callback.select(selectedPathNames);
  }

  domElement.addEventListener("mousedown", onMouseDown);
  domElement.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  this.destroy = () => {
    domElement.removeEventListener("mousedown", onMouseDown);
    domElement.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    helper.destroy();
    // TODO
  };
};

export { BoxSelectControls };
