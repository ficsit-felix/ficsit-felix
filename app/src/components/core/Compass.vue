<template>
  <div class="compass">
    <svg
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      width="46.226578mm"
      height="44.157784mm"
      viewBox="0 0 46.226578 44.157783"
      version="1.1"
      id="svg8"
      inkscape:version="0.92.4 5da689c313, 2019-01-14"
      sodipodi:docname="compass.svg"
    >
      <g
        inkscape:label="Layer 1"
        inkscape:groupmode="layer"
        id="layer1"
        transform="translate(-28.115,-18.634146)"
      >
        <g
          id="compass"
          inkscape:transform-center-x="1.5119048"
          inkscape:transform-center-y="0.18898972"
        >
          <g
            id="inner"
            v-bind:style="{
              transform:
                'rotateX(' + rotateX + 'rad) rotateZ(' + rotateZ + 'rad)'
            }"
          >
            <circle
              style="opacity:1;vector-effect:none;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.47099411;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              id="path4518"
              cy="40.713039"
              cx="51.228291"
              r="14.035886"
            />
            <path
              style="opacity:1;vector-effect:none;fill:#ff0000;fill-opacity:1;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              d="m 51.228289,28.428813 3.071056,12.284225 h -6.142113 z"
              id="rect4597"
              inkscape:connector-curvature="0"
              sodipodi:nodetypes="cccc"
            />
            <path
              sodipodi:nodetypes="cccc"
              inkscape:connector-curvature="0"
              id="path4600"
              d="M 51.228289,52.997263 54.299345,40.713038 H 48.157232 Z"
              style="opacity:1;vector-effect:none;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { Euler, Quaternion, Vector3 } from 'three';

export default {
  name: 'Compass',
  //  props: ['rotateX', 'rotateZ']
  data: () => {
    return {
      rotateX: 0,
      rotateZ: 0
    };
  },

  mounted() {
    window.onCompassUpdate = matrixWorldInverse => {
      let position = new Vector3();
      let quaternion = new Quaternion();
      let scale = new Vector3();

      matrixWorldInverse.decompose(position, quaternion, scale);
      const euler = new Euler().setFromQuaternion(quaternion);

      this.rotateX = euler.x;
      this.rotateZ = -euler.z - 3.14 / 2; // point correctly to north
      if (
        this.rotateX < -Math.PI / 2 + 0.2 &&
        this.rotateX > -Math.PI / 2 - 0.2
      ) {
        // don't go invisible at very small angle to map
        this.rotateX = -Math.PI / 2 + 0.2;
      }
    };
  },

  beforeDestroy() {
    window.onCompassUpdate = undefined;
  }
};
</script>

<style lang="scss" scoped>
.compass {
  position: absolute;
  bottom: -20px;
  right: -15px;
  opacity: 0.3;
  transform: scale(0.9);
  transition: opacity 0.3s ease-in-out;
}
.compass:hover {
  opacity: 1;
}
#inner {
  /* very wired origin point due to SVG shenanigans */
  transform-origin: 111% 92%;
}
</style>
