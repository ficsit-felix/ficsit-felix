import { CameraType } from '@/store/settings';
import { CAMERA_CHANGE } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { FlatControls } from '@lib/graphics/FlatControls.js';
import { FlyControls } from '@lib/graphics/FlyControls.js';
import { OrbitControls } from '@lib/graphics/OrbitControls.js';
import { MOUSE, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
import { mapActions, mapState } from 'vuex';
import Object3D from './Object3D';

export default {
  extends: Object3D,
  inject: ['renderer'],

  provide() {
    this.setupCamera();
    return {
      camera: this.obj,
    };
  },

  computed: {
    ...mapState(['cameraPosition', 'cameraTarget']),
    ...mapState('settings', ['nearPlane', 'farPlane', 'cameraType']),
  },

  watch: {
    position: {
      handler() {
        if (!this.obj) return;
        this.obj.lookAt(this.scene.position);
      },
      deep: true,
    },
    nearPlane(value) {
      this.obj.near = value;
      this.obj.updateProjectionMatrix();
    },
    farPlane(value) {
      this.obj.far = value;
      this.obj.updateProjectionMatrix();
    },
    cameraType(value, oldValue) {
      if ((value === CameraType.Flat) !== (oldValue === CameraType.Flat)) {
        // need to switch camera
        this.setupCamera();
        EventBus.$emit(CAMERA_CHANGE, this.obj);
      }

      this.setupControl(this.domElement);
    },
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

    setupCamera() {
      // looking north
      let cameraPosition = new Vector3(
        this.cameraType === CameraType.Flat ? 0 : 70000,
        0,
        60000
      );

      if (this.cameraPosition !== undefined) {
        cameraPosition = this.cameraPosition;
      }
      if (this.obj !== undefined) {
        cameraPosition = this.obj.position;
      }

      let camera;
      if (this.cameraType === CameraType.Flat) {
        camera = new OrthographicCamera(
          this.renderer.width / -2,
          this.renderer.width / 2,
          this.renderer.height / 2,
          this.renderer.height / -2,
          this.nearPlane,
          this.farPlane
        );

        // We want a top down view
        cameraPosition.z = 60000;
        camera.rotation.set(0, 0, Math.PI / 2);
        camera.zoom = 0.005;
        camera.updateProjectionMatrix();
      } else {
        camera = new PerspectiveCamera(
          70,
          this.renderer.width / this.renderer.height,
          this.nearPlane,
          this.farPlane
        );
      }

      camera.position.x = cameraPosition.x;
      camera.position.z = cameraPosition.z;
      camera.position.y = cameraPosition.y;

      camera.up.y = 0;
      camera.up.z = 1;

      this.obj = camera;
    },

    setupControl(domElement) {
      this.domElement = domElement;
      if (this.controls) {
        this.controls.dispose();
      }

      switch (this.cameraType) {
        case CameraType.Orbit:
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
          break;
        case CameraType.Fly:
          const flyControls = new FlyControls(this.obj, domElement);
          flyControls.movementSpeed = 50000;
          flyControls.domElement = domElement;
          flyControls.rollSpeed = Math.PI;
          flyControls.autoForward = false;
          flyControls.dragToLook = true;
          this.controls = flyControls;
          if (
            this.obj.rotation.x === 0 &&
            this.obj.rotation.y === 0 &&
            this.obj.rotation.z === 0
          ) {
            // Initial rotation
            this.controls.focus(0, 0, 0);
          }
          break;
        case CameraType.Flat:
          const flatControls = new FlatControls(this.obj, domElement);
          flatControls.addEventListener('change', this.onChange); // call this only in static scenes (i.e., if there is no animation loop)
          flatControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
          flatControls.dampingFactor = 0.5;
          flatControls.screenSpacePanning = false;
          flatControls.rotateSpeed = 1;
          flatControls.panSpeed = 1;
          flatControls.mouseButtons.LEFT = undefined;
          flatControls.mouseButtons.MIDDLE = MOUSE.PAN;
          flatControls.mouseButtons.RIGHT = MOUSE.ROTATE;
          flatControls.maxZoom = 0.1;
          flatControls.minZoom = 0.00008;

          this.controls = flatControls;
          break;
      }
      this.controls.update(0);
    },

    updateCameraState() {
      this.setCameraData({
        target: this.controls.target,
        position: this.obj.position,
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
    },
    resize(width, height) {
      if (this.cameraType === CameraType.Flat) {
        this.obj.left = width / -2;
        this.obj.right = width / 2;
        this.obj.top = height / 2;
        this.obj.bottom = height / -2;
        this.obj.updateProjectionMatrix();
      }
    },
  },

  beforeDestroy() {
    if (this.controls) {
      this.controls.dispose();
    }
  },
};
