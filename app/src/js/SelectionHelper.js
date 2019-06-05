/**
 * @author HypnosNova / https://www.threejs.org.cn/gallery
 */

import * as THREE from "three";
import { MOUSE } from "three";
var SelectionHelper = (function() {
  function SelectionHelper(
    selectionBox,
    domElement,
    cssClassName,
    boxSelectControls
  ) {
    this.element = document.createElement("div");
    this.element.classList.add(cssClassName);
    this.element.style.pointerEvents = "none";

    this.domElement = domElement;

    this.startPoint = new THREE.Vector2();
    this.pointTopLeft = new THREE.Vector2();
    this.pointBottomRight = new THREE.Vector2();

    this.isDown = false;

    this.domElement.addEventListener(
      "mousedown",
      function(event) {
        if (boxSelectControls.disabled) {
          return;
        }
        if (event.button != MOUSE.LEFT) {
          return;
        }

        this.isDown = true;
        this.onSelectStart(event);
      }.bind(this),
      false
    );

    this.domElement.addEventListener(
      "mousemove",
      function(event) {
        if (boxSelectControls.disabled) {
          return;
        }
        if (this.isDown) {
          this.onSelectMove(event);
        }
      }.bind(this),
      false
    );

    document.addEventListener(
      "mouseup",
      function(event) {
        if (boxSelectControls.disabled) {
          return;
        }
        if (this.isDown) {
          this.isDown = false;
          this.onSelectOver(event);
        }
      }.bind(this),
      false
    );
  }

  SelectionHelper.prototype.onSelectStart = function(event) {
    this.domElement.parentElement.appendChild(this.element);

    this.element.style.left = event.clientX + "px";
    this.element.style.top = event.clientY + "px";
    this.element.style.width = "0px";
    this.element.style.height = "0px";

    this.startPoint.x = event.clientX;
    this.startPoint.y = event.clientY;
  };

  SelectionHelper.prototype.onSelectMove = function(event) {
    this.pointBottomRight.x = Math.max(this.startPoint.x, event.clientX);
    this.pointBottomRight.y = Math.max(this.startPoint.y, event.clientY);
    this.pointTopLeft.x = Math.min(this.startPoint.x, event.clientX);
    this.pointTopLeft.y = Math.min(this.startPoint.y, event.clientY);

    this.element.style.left = this.pointTopLeft.x + "px";
    this.element.style.top = this.pointTopLeft.y + "px";
    this.element.style.width =
      this.pointBottomRight.x - this.pointTopLeft.x + "px";
    this.element.style.height =
      this.pointBottomRight.y - this.pointTopLeft.y + "px";
  };

  SelectionHelper.prototype.onSelectOver = function() {
    this.element.parentElement.removeChild(this.element);
  };

  SelectionHelper.prototype.destroy = function() {
    // TODO unregister event listeners
  };

  return SelectionHelper;
})();

export { SelectionHelper };
