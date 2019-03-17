import { WebGLRenderer } from "three";
import { SelectControls } from "../../js/SelectControls";
import { mapActions } from "vuex";

// see https://github.com/posva/state-animation-demos/tree/master/components/three

export default {
  props: {
    width: Number,
    height: Number
  },

  provide() {
    this.renderer = new WebGLRenderer();
    /*this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = BasicShadowMap*/

    return {
      renderer: this
    };
  },

  mounted() {
    var elem = document.getElementById("scene");
    var width = document.getElementById("scene").offsetWidth;
    var height = document.getElementById("scene").offsetHeight;
    this.renderer.setSize(width, height);
    this.camera.obj.aspect = width / height;
    this.camera.obj.updateProjectionMatrix();
    this.animate();
    this.selectControls = new SelectControls(
      this.scene,
      this.camera.obj,
      elem,
      this
    );
    this.camera.setupControl(elem);
  },

  methods: {
    ...mapActions(["select"]),
    animate() {
      if (this.scene && this.camera) {
        this.camera.updateControls();
        this.renderer.render(this.scene, this.camera.obj);
      } else {
        // console.warn('You need a scene and a camera inside of the renderer')
      }
      requestAnimationFrame(this.animate.bind(this));
    }
  },

  render(h) {
    this.$nextTick().then(() => {
      this.$el.appendChild(this.renderer.domElement);
    });
    return h("div", this.$slots.default);
  },

  beforeDestroy() {
    this.selectControls.destroy();
  }
};
