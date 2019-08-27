<template>
  <div class="titlebar" id="titlebar">
    <div
      class="titlebar-title"
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
    >
      <Logo :height="30" black="#505050" :animating="logoAnimating"></Logo>
    </div>
    <div class="titlebar-spacer"></div>
    <div class="titlebar-controls">
      <div class="titlebar-minimize" id="min-btn">
        <svg x="0px" y="0px" viewBox="0 0 10 1">
          <rect fill="#000000" width="10" height="1"></rect>
        </svg>
      </div>
      <div class="titlebar-resize" id="max-btn">
        <svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10">
          <path
            fill="#000000"
            d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "
          />
        </svg>
        <svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
          <mask id="Mask">
            <rect fill="#FFFFFF" width="10" height="10"></rect>
            <path
              fill="#000000"
              d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z"
            />
            <path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
          </mask>
          <path
            fill="#000000"
            d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z"
            mask="url(#Mask)"
          />
        </svg>
      </div>
      <div class="titlebar-close" id="close-btn">
        <svg x="0px" y="0px" viewBox="0 0 10 10">
          <polygon
            fill="#000000"
            points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"
          ></polygon>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  display: flex;
  position: relative;
  height: 32px;
  padding: 0;
  cursor: default;
  user-select: none;
  -webkit-app-region: drag;
}

.titlebar-title {
  /*padding: 6px 14px;  for text */
  margin-left: 8px;
  font-size: 13px;
  color: #696f7b;
}

.titlebar-spacer {
  flex-grow: 1;
}

.titlebar-controls {
  text-align: left;
}

.titlebar-minimize,
.titlebar-resize,
.titlebar-close {
  float: left;
  width: 45px;
  height: 31px;
  /*margin: 1px 1px 0 0;*/
  text-align: center;
  line-height: 29px;

  -webkit-transition: background-color 0.2s;
  -moz-transition: background-color 0.2s;
  -ms-transition: background-color 0.2s;
  -o-transition: background-color 0.2s;
  transition: background-color 0.2s;
}

.titlebar-minimize,
.titlebar-resize,
.titlebar-close {
  -webkit-app-region: no-drag;
}

.titlebar-minimize svg,
.titlebar-resize svg.maximize-svg,
.titlebar-resize svg.fullscreen-svg,
.titlebar-close svg {
  width: 10px;
  height: 10px;
  shape-rendering: crispEdges;
}

.titlebar-close svg polygon {
  -webkit-transition: fill 0.2s;
  -moz-transition: fill 0.2s;
  -ms-transition: fill 0.2s;
  -o-transition: fill 0.2s;
  transition: fill 0.2s;
}

.titlebar:not(.fullscreen) svg.maximize-svg {
  display: none;
}

.titlebar.fullscreen svg.fullscreen-svg {
  display: none;
}

.titlebar-minimize:hover,
.titlebar-resize:hover,
.titlebar-fullscreen:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
}

.titlebar-close:hover svg polygon {
  fill: rgba(255, 255, 255, 1);
}

svg polygon,
svg rect,
svg > path {
  fill: #9da5b4;
}

.titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
}
</style>

<script>
import Logo from '../core/Logo.vue';

export default {
  name: 'Titlebar',
  components: {
    Logo
  },
  data: function() {
    return {
      logoAnimating: false
    };
  },
  watch: {
    logoAnimating(val) {
      console.log(val);
    }
  },
  mounted() {
    const titlebarElement = document.getElementById('titlebar');
    const remote = require('electron').remote;

    document.getElementById('min-btn').addEventListener('click', function(e) {
      const window = remote.getCurrentWindow();
      window.minimize();
    });

    document.getElementById('max-btn').addEventListener('click', function(e) {
      const window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }

      if (window.isMaximized()) {
        titlebarElement.classList.add('fullscreen');
      } else {
        titlebarElement.classList.remove('fullscreen');
      }
    });

    document.getElementById('close-btn').addEventListener('click', function(e) {
      const window = remote.getCurrentWindow();
      window.close();
    });
  }
};
</script>
