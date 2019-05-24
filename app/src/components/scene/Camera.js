import Object3D from "./Object3D";
import { PerspectiveCamera } from "three";
// import { OrbitControls } from '~/plugins/three'
import { OrbitControls } from "@/js/OrbitControls";
import { mapActions, mapState } from "vuex";

export default {
  extends: Object3D,
  inject: ["renderer"],

  provide() {
    const camera = new PerspectiveCamera(
      70,
      this.renderer.width / this.renderer.height,
      100,
      200000
    );

    if (this.cameraPosition !== undefined) {
      camera.position.x = this.cameraPosition.x;
      camera.position.z = this.cameraPosition.z;
      camera.position.y = this.cameraPosition.y;
    } else {
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
    ...mapState([
      'cameraPosition',
      'cameraTarget'
    ])
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
    ...mapActions(["setCameraData"]),

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
    }
  },

  beforeDestroy() {
    if (this.controls) {
      this.controls.dispose();
    }
  }
};
