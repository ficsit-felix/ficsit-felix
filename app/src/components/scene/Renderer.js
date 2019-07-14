import { WebGLRenderer } from 'three';
import { SelectControls } from '@/js/SelectControls';
import { BoxSelectControls } from '@/js/BoxSelectControls';
import { mapActions, mapState } from 'vuex';

import * as Stats from 'stats.js';
// see https://github.com/posva/state-animation-demos/tree/master/components/three

export default {
  props: {
    width: Number,
    height: Number
  },
  inject: ['playground'],

  provide() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true
    });

    return {
      renderer: this
    };
  },

  data: function() {
    return {
      animating: true
    };
  },

  mounted() {
    if (this.showFps) {
      this.showStats();
    } else {
      this.stats = null;
    }

    var elem = document.getElementById('scene');
    var width = document.getElementById('scene').offsetWidth;
    var height = document.getElementById('scene').offsetHeight;
    this.renderer.setSize(width, height);
    this.camera.obj.aspect = width / height;
    this.camera.obj.updateProjectionMatrix();
    this.animate();
    this.selectControls = new SelectControls(
      this.scene,
      this.camera.obj,
      elem,
      this,
      this.playground
    );
    this.boxSelectControls = new BoxSelectControls(
      this.scene,
      this.camera.obj,
      elem,
      this,
      this.playground
    );

    this.camera.setupControl(elem);
  },
  computed: {
    ...mapState(['selectionDisabled', 'boxSelect']),
    ...mapState('settings', ['showFps'])
  },

  watch: {
    width() {
      this.resize();
    },
    height() {
      this.resize();
    },
    selectionDisabled(val) {
      if (val) {
        this.boxSelectControls.disabled = true;
        this.selectControls.disabled = true;
      } else {
        this.boxSelectControls.disabled = !this.boxSelect;
        this.selectControls.disabled = this.boxSelect;
      }
    },
    boxSelect(val) {
      if (!this.selectionDisabled) {
        this.boxSelectControls.disabled = !val;
        this.selectControls.disabled = val;
      }
    },
    showFps(val) {
      if (val) {
        this.showStats();
      } else {
        this.hideStats();
      }
    }
  },
  methods: {
    ...mapActions(['select']),
    animate() {
      if (this.stats !== null) {
        this.stats.begin();
      }
      if (this.scene && this.camera) {
        this.camera.updateControls();
        this.renderer.render(this.scene, this.camera.obj);
      } else {
        // console.warn('You need a scene and a camera inside of the renderer')
      }
      if (this.stats !== null) {
        this.stats.end();
      }
      if (this.animating) {
        requestAnimationFrame(this.animate.bind(this));
      }
    },

    resize() {
      this.renderer.setSize(this.width, this.height);
      this.camera.obj.aspect = this.width / this.height;
      this.camera.obj.updateProjectionMatrix();
    },
    showStats() {
      this.stats = new Stats();
      this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
    },
    hideStats() {
      if (this.stats !== null) {
        document.body.removeChild(this.stats.dom);
      }
      this.stats = null;
    }
  },

  render(h) {
    this.$nextTick().then(() => {
      this.$el.appendChild(this.renderer.domElement);
    });
    return h('div', this.$slots.default);
  },

  beforeDestroy() {
    this.selectControls.destroy();
    this.boxSelectControls.destroy();
    this.hideStats();
    this.animating = false;
  }
};
