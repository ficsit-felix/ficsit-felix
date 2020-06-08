import { SelectionBox } from '@lib/graphics/SelectionBox.js';
import { SelectionHelper } from '@lib/graphics/SelectionHelper.js';
import * as THREE from 'three';
import { MOUSE } from 'three';

let BoxSelectControls = function(
  scene,
  camera,
  domElement,
  callback, // renderer object
  playground
) {
  this.disabled = true;
  this.isDown = false;

  let selectionBox = new SelectionBox(camera.obj, scene);
  let helper = new SelectionHelper(selectionBox, domElement, 'selectBox', this);
  let scope = this;

  function onMouseDown(event) {
    if (scope.disabled) {
      return;
    }
    /*for (let item of selectionBox.collection) {
      item.material.emissive = new THREE.Color(0x000000);
    }*/

    if (event.button !== MOUSE.LEFT) {
      return;
    }
    scope.isDown = true;
    let rect = domElement.getBoundingClientRect();
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
      /*for (let i = 0; i < selectionBox.collection.length; i++) {
        selectionBox.collection[i].material.emissive = new THREE.Color(
          0x000000
        );
      }*/
      let rect = domElement.getBoundingClientRect();
      selectionBox.endPoint.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
        0.5
      );
      // let allSelected = selectionBox.select();
      /*      for (let j = 0; j < allSelected.length; j++) { asdf
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
    let rect = domElement.getBoundingClientRect();
    selectionBox.endPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
      0.5
    );
    let allSelected = selectionBox.select(
      playground.meshManager.raycastActiveMeshes
    );
    let selectedPathNames = [];
    for (const mesh of allSelected) {
      if (mesh.userData !== undefined && mesh.userData.pathName !== undefined) {
        selectedPathNames.push(mesh.userData.pathName);
      }
    }
    callback.select(selectedPathNames);
  }

  domElement.addEventListener('mousedown', onMouseDown);
  domElement.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  this.destroy = () => {
    domElement.removeEventListener('mousedown', onMouseDown);
    domElement.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    helper.destroy();
    // TODO
  };
};

export { BoxSelectControls };
