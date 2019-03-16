<template>
  <div class="scene">
    <vgl-renderer antialias style="height:100%;">
      <vgl-scene :background="background" ref="scene">
        <vgl-sphere-geometry name="sphere"></vgl-sphere-geometry>
        <vgl-box-geometry name="cube"></vgl-box-geometry>
        <vgl-mesh-standard-material name="std"></vgl-mesh-standard-material>
        <vgl-mesh geometry="cube" material="std"></vgl-mesh>

        <Cube v-for="(cube, index) in cubes" :key="index"></Cube>
        <vgl-ambient-light color="#ffeecc"></vgl-ambient-light>

        <vgl-axes-helper :position="position"></vgl-axes-helper>
      </vgl-scene>
      <vgl-perspective-camera orbit-position="6 1 1;"></vgl-perspective-camera>
    </vgl-renderer>
  </div>
</template>

<style lang="scss">
.scene {
  flex-grow: 1;
}
</style>

<script>
import * as THREE from "three";
import Cube from "@/components/scene/Cube";

export default {
  name: "Scene",
  components: {
    Cube
  },
  computed: {
    background: function() {
      return new THREE.Color(0x16161d);
    },
    position: function() {
      return new THREE.Vector3(1, 1.5, 3);
    }
  },
  data: function() {
    return {
      cubes: [
        {
          position: [1, 2, 3]
        },
        {
          position: [2, 3, 4]
        }
      ]
    };
  }

  /*,

    mounted() {
        console.log('asdf');
        console.log(this.$refs.scene);
    }*/
};
</script>
