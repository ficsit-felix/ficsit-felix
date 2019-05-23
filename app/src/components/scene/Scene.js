import Object3D from "./Object3D";
import { Scene, Color, Fog } from "three";

export default {
  ...Object3D,
  inject: ["renderer"],

  provide() {
    this.scene = new Scene();
    return {
      scene: this.scene
    };
  },

  // overwrite existing mounted
  mounted() {
    this.renderer.scene = this.scene;
    this.scene.background = new Color(0x000000);
    this.scene.fog = new Fog(0x000000, 150000, 200000);
    // console.log('scene', this.scene)
  }
};
