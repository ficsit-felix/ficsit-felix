/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

import { Quaternion, Vector3, Euler, EventDispatcher } from 'three';

var FlyControls = function (object, domElement) {
  if (domElement === undefined) {
    console.warn(
      'THREE.FlyControls: The second parameter "domElement" is now mandatory.'
    );
    domElement = document;
  }

  this.object = object;
  this.domElement = domElement;

  if (domElement) this.domElement.setAttribute('tabindex', -1);

  // API

  this.movementSpeed = 1.0;
  this.rollSpeed = 0.005;

  this.dragToLook = false;
  this.autoForward = false;

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new Quaternion();

  this.tmpEuler = object.rotation.clone();
  this.tmpEuler.reorder('ZYX');
  //this.tmpEuler = new Euler(0, 0, 0, 'ZYX');

  this.mouseStatus = 0;
  this.mouseOffset = {
    x: 0,
    y: 0,
  };

  this.moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    forward: 0,
    back: 0,
    pitchUp: 0,
    pitchDown: 0,
    yawLeft: 0,
    yawRight: 0,
    rollLeft: 0,
    rollRight: 0,
  };
  this.moveVector = new Vector3(0, 0, 0);
  this.rotationVector = new Vector3(0, 0, 0);

  this.keydown = function (event) {
    if (event.altKey) {
      return;
    }

    //event.preventDefault();

    switch (event.keyCode) {
      case 16:
        /* shift */ this.movementSpeedMultiplier = 0.1;
        break;

      // case 87:
      //   /*W*/ this.moveState.forward = 1;
      //   break;
      // case 83:
      //   /*S*/ this.moveState.back = 1;
      //   break;

      // case 65:
      //   /*A*/ this.moveState.left = 1;
      //   break;
      // case 68:
      //   /*D*/ this.moveState.right = 1;
      //   break;

      // case 82:
      //   /*R*/ this.moveState.up = 1;
      //   break;
      // case 70:
      //   /*F*/ this.moveState.down = 1;
      //   break;

      case 38:
        /*up*/ this.moveState.forward = 1; //this.moveState.pitchUp = 1;
        break;
      case 40:
        /*down*/ this.moveState.back = 1; // this.moveState.pitchDown = 1;
        break;

      case 37:
        /*left*/ this.moveState.left = 1; // this.moveState.yawLeft = 1;
        break;
      case 39:
        /*right*/ this.moveState.right = 1; //this.moveState.yawRight = 1;
        break;

      // case 81:
      //   /*Q*/ this.moveState.rollLeft = 1;
      //   break;
      // case 69:
      //   /*E*/ this.moveState.rollRight = 1;
      //   break;
    }

    this.updateMovementVector();
    this.updateRotationVector();
  };

  this.keyup = function (event) {
    switch (event.keyCode) {
      case 16:
        /* shift */ this.movementSpeedMultiplier = 1;
        break;

      // case 87:
      //   /*W*/ this.moveState.forward = 0;
      //   break;
      // case 83:
      //   /*S*/ this.moveState.back = 0;
      //   break;

      // case 65:
      //   /*A*/ this.moveState.left = 0;
      //   break;
      // case 68:
      //   /*D*/ this.moveState.right = 0;
      //   break;

      // case 82:
      //   /*R*/ this.moveState.up = 0;
      //   break;
      // case 70:
      //   /*F*/ this.moveState.down = 0;
      //   break;

      case 38:
        /*up*/ this.moveState.forward = 0; // this.moveState.pitchUp = 0;
        break;
      case 40:
        /*down*/ this.moveState.back = 0; //this.moveState.pitchDown = 0;
        break;

      case 37:
        /*left*/ this.moveState.left = 0; // this.moveState.yawLeft = 0;
        break;
      case 39:
        /*right*/ this.moveState.right = 0; //this.moveState.yawRight = 0;
        break;

      // case 81:
      //   /*Q*/ this.moveState.rollLeft = 0;
      //   break;
      // case 69:
      //   /*E*/ this.moveState.rollRight = 0;
      //   break;
    }

    this.updateMovementVector();
    this.updateRotationVector();
  };

  this.mousedown = function (event) {
    if (this.domElement !== document) {
      this.domElement.focus();
    }

    /*event.preventDefault();
    event.stopPropagation();*/

    if (this.dragToLook && event.button == 2) {
      // right click
      this.mouseStatus = 1;
      var container = this.getContainerDimensions();
      var halfWidth = container.size[0] / 2;
      var halfHeight = container.size[1] / 2;
      this.mouseOffset.x = event.pageX - halfWidth;
      this.mouseOffset.y = event.pageY - halfHeight;
    } else {
      // switch (event.button) {
      //   case 0:
      //     this.moveState.forward = 1;
      //     break;
      //   case 2:
      //     this.moveState.back = 1;
      //     break;
      // }
      // this.updateMovementVector();
    }
  };

  this.mousemove = function (event) {
    if (!this.dragToLook || this.mouseStatus > 0) {
      var container = this.getContainerDimensions();
      var halfWidth = container.size[0] / 2;
      var halfHeight = container.size[1] / 2;

      this.moveState.yawLeft =
        -(event.pageX - this.mouseOffset.x - container.offset[0] - halfWidth) /
        halfWidth;
      this.moveState.pitchDown =
        (event.pageY - this.mouseOffset.y - container.offset[1] - halfHeight) /
        halfHeight;

      this.updateRotationVector();
    }
  };

  this.mouseup = function (event) {
    /*event.preventDefault();
    event.stopPropagation();*/

    if (this.dragToLook && event.button == 2) {
      this.mouseStatus = 0;

      this.moveState.yawLeft = this.moveState.pitchDown = 0;
    } else {
      // switch (event.button) {
      //   case 0:
      //     this.moveState.forward = 0;
      //     break;
      //   case 2:
      //     this.moveState.back = 0;
      //     break;
      // }
      // this.updateMovementVector();
    }

    this.updateRotationVector();
  };

  this.update = function (delta) {
    if (
      this.moveVector.x === 0 &&
      this.moveVector.y === 0 &&
      this.moveVector.z === 0 &&
      this.rotationVector.x === 0 &&
      this.rotationVector.y === 0 &&
      this.rotationVector.z === 0
    ) {
      // no change
      return;
    }

    this.dispatchEvent('change');

    var moveMult = delta * this.movementSpeed;
    var rotMult = delta * this.rollSpeed;

    this.object.translateX(this.moveVector.x * moveMult);
    this.object.translateY(this.moveVector.y * moveMult);
    this.object.translateZ(this.moveVector.z * moveMult);

    /*this.tmpQuaternion
      .set(
        this.rotationVector.x * rotMult,
        this.rotationVector.y * rotMult,
        this.rotationVector.z * rotMult,
        1
      )
      .normalize();
      */
    // @bitowl use Euler angles to remove roll
    this.tmpEuler.x += this.rotationVector.x * rotMult;

    // Restrict vertical rotation
    this.tmpEuler.x = Math.max(0, Math.min(this.tmpEuler.x, Math.PI));

    this.tmpEuler.y += this.rotationVector.y * rotMult;
    this.tmpEuler.z += this.rotationVector.z * rotMult;

    //this.tmpQuaternion.setFromEuler(this.tmpEuler);
    this.object.setRotationFromEuler(this.tmpEuler);
    //this.object.quaternion.multiply(this.tmpQuaternion);

    // expose the rotation vector for convenience
    // this.object.rotation.setFromQuaternion(
    //   this.object.quaternion,
    //   this.object.rotation.order
    // );
  };

  this.updateMovementVector = function () {
    var forward =
      this.moveState.forward || (this.autoForward && !this.moveState.back)
        ? 1
        : 0;

    this.moveVector.x = -this.moveState.left + this.moveState.right;
    this.moveVector.y = -this.moveState.down + this.moveState.up;
    this.moveVector.z = -forward + this.moveState.back;

    //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
  };

  this.updateRotationVector = function () {
    this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp;
    this.rotationVector.z = -this.moveState.yawRight + this.moveState.yawLeft;
    //this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft;

    //console.log('rotate:', [this.rotationVector.x, this.rotationVector.y, this.rotationVector.z]);
  };

  this.getContainerDimensions = function () {
    if (this.domElement != document) {
      return {
        size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
        offset: [this.domElement.offsetLeft, this.domElement.offsetTop],
      };
    } else {
      return {
        size: [window.innerWidth, window.innerHeight],
        offset: [0, 0],
      };
    }
  };

  function bind(scope, fn) {
    return function () {
      fn.apply(scope, arguments);
    };
  }

  function contextmenu(event) {
    event.preventDefault();
  }

  this.focus = function (x, y, z) {
    this.object.lookAt(x, y, z);

    // fix euler angle
    this.tmpEuler = object.rotation.clone();
    this.tmpEuler.reorder('ZYX');
  };

  this.dispose = function () {
    this.domElement.removeEventListener('contextmenu', contextmenu, false);
    this.domElement.removeEventListener('mousedown', _mousedown, false);
    this.domElement.removeEventListener('mousemove', _mousemove, false);
    this.domElement.removeEventListener('mouseup', _mouseup, false);

    this.domElement.removeEventListener('keydown', _keydown, false);
    window.removeEventListener('keyup', _keyup, false);
  };

  var _mousemove = bind(this, this.mousemove);
  var _mousedown = bind(this, this.mousedown);
  var _mouseup = bind(this, this.mouseup);
  var _keydown = bind(this, this.keydown);
  var _keyup = bind(this, this.keyup);

  this.domElement.addEventListener('contextmenu', contextmenu, false);

  this.domElement.addEventListener('mousemove', _mousemove, false);
  this.domElement.addEventListener('mousedown', _mousedown, false);
  this.domElement.addEventListener('mouseup', _mouseup, false);

  this.domElement.addEventListener('keydown', _keydown, false);
  window.addEventListener('keyup', _keyup, false);

  this.updateMovementVector();
  this.updateRotationVector();
};

FlyControls.prototype = Object.create(EventDispatcher.prototype);
FlyControls.prototype.constructor = FlyControls;

export { FlyControls };
