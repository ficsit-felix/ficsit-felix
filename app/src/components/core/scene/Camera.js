import Object3D from './Object3D';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from '@lib/graphics/OrbitControls.js';
import { mapActions, mapState } from 'vuex';

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

    //new OrbitControls(this.camera)
    return {
      camera: this.obj
    };
  },

  computed: {
    ...mapState(['cameraPosition', 'cameraTarget']),
    ...mapState('settings', ['nearPlane', 'farPlane'])
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
    }
  },

  mounted() {
    this.renderer.camera = this;

    // Update once window.onCompassChange is hopefully registered.
    // Will most probably still be while the progress bar is visible, so it should be fine.
    setTimeout(() => this.onChange(), 500);
  },

  methods: {
    ...mapActions(['setCameraData']),

    setupControl(domElement) {
      const controls = new OrbitControls(this.obj, domElement);
      controls.addEventListener('change', this.onChange); // call this only in static scenes (i.e., if there is no animation loop)
      controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.minDistance = 1000;
      controls.maxDistance = 100000;
      controls.maxPolarAngle = Math.PI;
      controls.rotateSpeed = 0.3;
      controls.panSpeed = 0.3;
      if (this.cameraTarget !== undefined) {
        controls.target = this.cameraTarget;
      }

      // controls.addEventListener('end', this.updateCameraState);
      this.controls = controls;
    },
    updateCameraState() {
      this.setCameraData({
        target: this.controls.target,
        position: this.obj.position
      });
    },
    updateControls() {
      if (this.controls) {
        this.controls.update();
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
