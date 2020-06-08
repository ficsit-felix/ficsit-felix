import Object3D from './Object3D';
import { PerspectiveCamera, MOUSE } from 'three';
import { OrbitControls } from '@lib/graphics/OrbitControls.js';
import { FlyControls } from '@lib/graphics/FlyControls.js';
import { mapActions, mapState } from 'vuex';
import { CameraType } from '@/store/settings';

export default {
  extends: Object3D,
  inject: ['renderer'],

  provide() {
    const camera = new PerspectiveCamera(
      70,
      this.renderer.width / this.renderer.height,
      this.nearPlane,
      this.farPlane
    );

    if (this.cameraPosition !== undefined) {
      camera.position.x = this.cameraPosition.x;
      camera.position.z = this.cameraPosition.z;
      camera.position.y = this.cameraPosition.y;
    } else {
      // looking north
      camera.position.x = 70000;
      camera.position.y = 0;
      camera.position.z = 60000;
    }
    camera.up.y = 0;
    camera.up.z = 1;
    this.obj = camera;

    camera.lookAt(0, 0, 0);
    return {
      camera: this.obj
    };
  },

  computed: {
    ...mapState(['cameraPosition', 'cameraTarget']),
    ...mapState('settings', ['nearPlane', 'farPlane', 'cameraType'])
  },

  watch: {
    position: {
      handler() {
        if (!this.obj) return;
        this.obj.lookAt(this.scene.position);
      },
      deep: true
    },
    nearPlane(value) {
      this.obj.near = value;
      this.obj.updateProjectionMatrix();
    },
    farPlane(value) {
      this.obj.far = value;
      this.obj.updateProjectionMatrix();
    },
    cameraType(value) {
      this.setupControl(this.domElement);
    }
  },

  mounted() {
    this.renderer.camera = this;

    // Update once window.onCompassChange is hopefully registered.
    // Will most probably still be while the progress bar is visible, so it should be fine.
    setTimeout(() => this.onChange(), 500);
    this.lastDate = Date.now();
  },

  methods: {
    ...mapActions(['setCameraData']),

    setupControl(domElement) {
      this.domElement = domElement;
      if (this.controls) {
        this.controls.dispose();
      }
      if (this.cameraType === CameraType.Orbit) {
        const controls = new OrbitControls(this.obj, domElement);
        controls.addEventListener('change', this.onChange); // call this only in static scenes (i.e., if there is no animation loop)
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 1000;
        controls.maxDistance = 100000;
        controls.maxPolarAngle = Math.PI;
        controls.rotateSpeed = 1;
        controls.panSpeed = 1;
        controls.mouseButtons.LEFT = undefined;
        controls.mouseButtons.MIDDLE = MOUSE.PAN;
        controls.mouseButtons.RIGHT = MOUSE.ROTATE;
        if (this.cameraTarget !== undefined) {
          controls.target = this.cameraTarget;
        }

        // controls.addEventListener('end', this.updateCameraState);
        this.controls = controls;
      } else {
        const controls = new FlyControls(this.obj, domElement);
        controls.movementSpeed = 50000;
        controls.domElement = domElement;
        controls.rollSpeed = Math.PI;
        controls.autoForward = false;
        controls.dragToLook = true;
        this.controls = controls;
        window.controls = controls;
      }
    },

    updateCameraState() {
      this.setCameraData({
        target: this.controls.target,
        position: this.obj.position
      });
    },
    updateControls() {
      if (this.controls) {
        const now = Date.now();
        const delta = (now - this.lastDate) / 1000.0;
        this.lastDate = now;
        this.controls.update(delta); // TODO pass delta time
      }
    },
    onChange() {
      // currently disabled https://github.com/ficsit-felix/ficsit-felix/issues/86#issuecomment-512925021
      //this.$emit('cameraChange');
      if (window.onCompassUpdate) {
        window.onCompassUpdate(this.obj.matrixWorldInverse);
      }
    }
  },

  beforeDestroy() {
    if (this.controls) {
      this.controls.dispose();
    }
  }
};
