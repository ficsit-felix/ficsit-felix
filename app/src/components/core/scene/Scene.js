import { Color, Fog, Scene } from 'three';
import { mapState } from 'vuex';
import Object3D from './Object3D';

export default {
  ...Object3D,
  inject: ['renderer'],

  provide() {
    this.scene = new Scene();
    return {
      scene: this.scene,
    };
  },

  computed: {
    ...mapState('settings', ['farPlane']),
  },

  // overwrite existing mounted
  mounted() {
    this.renderer.scene = this.scene;
    this.scene.background = new Color(0x111618);
    this.scene.fog = new Fog(0x111618, 0.8 * this.farPlane, this.farPlane);
  },
  watch: {
    farPlane(value) {
      this.scene.fog = new Fog(0x111618, 0.8 * this.farPlane, this.farPlane);
    },
  },
};
