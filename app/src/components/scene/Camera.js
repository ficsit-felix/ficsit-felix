import Object3D from "./Object3D";
import { PerspectiveCamera } from "three";
// import { OrbitControls } from '~/plugins/three'
import { OrbitControls } from "@/js/OrbitControls";

export default {
  extends: Object3D,
  inject: ["renderer"],

  provide() {
    const camera = new PerspectiveCamera(
      70,
      this.renderer.width / this.renderer.height,
      1,
      5000000
    );
    camera.position.x = -17810;
    camera.position.z = 247550;
    camera.position.y = -1000;
    camera.up.y = 0;
    camera.up.z = 1;
    this.obj = camera;

    // new OrbitControls(this.camera)
    return {
      camera: this.obj
    };
  },

  watch: {
    position: {
      handler() {
        if (!this.obj) return;
        this.obj.lookAt(this.scene.position);
      },
      deep: true
    }
  },

  mounted() {
    this.renderer.camera = this;

    // this.obj.lookAt(this.scene.position)
    // console.log('camera', this.obj)
  },

  methods: {
    setupControl(domElement) {
      const controls = new OrbitControls(this.obj, domElement);
      //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
      controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.minDistance = 1000;
      controls.maxDistance = 100000;
      controls.maxPolarAngle = Math.PI / 2;
      controls.rotateSpeed = 0.3;
      controls.panSpeed = 0.3;
      this.controls = controls;
    },
    updateControls() {
      if (this.controls) {
        this.controls.update();
      }
    }
  },

  beforeDestroy() {
    if (this.controls) {
      this.controls.dispose();
    }
  }
};
