<template>
  <div class="scene" id="scene">
    <Renderer>
      <Scene>
        <AmbientLight />
        <Camera />
        <Cube
          v-for="(obj, index) in getVisibleObjects"
          :key="index"
          :object="obj"
        />
      </Scene>
    </Renderer>
    {{ getVisibleObjects.length }}
    <!--<p v-for="(obj,index) in getVisibleObjects" :key="index">
        {{obj.type}}
    </p>-->
    <!--scene
    <div id="information">test</div>-->
    <!--   <div
      id="glContainer"
      ref="container"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
    ></div>-->
    <!--	<script src="js/three.js"></script>

		<script src="js/controls/DragControls.js"></script>
        <script src="js/controls/TrackballControls.js"></script>
        <script src="js/controls/FlyControls.js"></script>
        <script src="js/controls/MapControls.js"></script>
        <script src="js/controls/OrbitControls.js"></script>
        <script src="js/controls/TransformControls.js"></script>

        <script src="js/libs/stats.min.js"></script>
        
        <script src="big.js"></script>
    -->
  </div>
</template>

<style lang="scss">
.scene {
  flex-grow: 1;
}
#glContainer {
  height: 100%;
}
</style>

<script>
import * as THREE from "three";
import { OrbitControls } from "@/js/OrbitControls";
import { SelectControls } from "@/js/SelectControls";
import { mapActions, mapGetters } from "vuex";
import Scene from "@/components/scene/Scene";
import Renderer from "@/components/scene/Renderer";
import Cube from "@/components/scene/Cube";
import Camera from "@/components/scene/Camera";
import AmbientLight from "@/components/scene/AmbientLight";

export default {
  name: "Playground",
  components: {
    Renderer,
    Scene,
    Cube,
    Camera,
    AmbientLight
  },
  computed: {
    ...mapGetters(["getVisibleObjects"])
  },
  mounted() {
    this.loadData()
      .then(response => {
        console.log(this);
        //     this.addCubes(response);
      })
      .catch(err => {
        console.error(err);
      });

    // var container; // , stats
    // var camera, scene, renderer, controls;
    // this.objects = [];

    // container = this.$refs.container;
    // console.log(this.$refs);

    // camera = new THREE.PerspectiveCamera(
    //   70,
    //   container.offsetWidth / container.offsetHeight,
    //   1,
    //   5000000
    // );
    // camera.position.x = -17810;
    // camera.position.z = 247550;
    // camera.position.y = -1000;
    // camera.up.y = 0;
    // camera.up.z = 1;

    // renderer = new THREE.WebGLRenderer({ antialias: true, height: "100%" });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(container.offsetWidth, container.offsetHeight);
    // renderer.shadowMap.enabled = false;
    // renderer.shadowMap.type = THREE.PCFShadowMap; // TODO

    // /*controls = new THREE.TrackballControls( camera );
    // 			controls.rotateSpeed = 1.0;
    // 			controls.zoomSpeed = 1.2;
    // 			controls.panSpeed = 0.8;
    // 			controls.noZoom = false;
    // 			controls.noPan = false;
    // 			controls.staticMoving = true;
    //             controls.dynamicDampingFactor = 0.3;*/

    // /*controls = new THREE.FlyControls(camera);
    //             controls.movementSpeed = 1000;
    //             controls.domElement = renderer.domElement;
    //             controls.rollSpeed = Math.PI / 24;
    //             controls.autoForward = false;
    //             controls.dragToLook = true;*/

    // controls = new OrbitControls(camera, renderer.domElement);
    // //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.25;
    // controls.screenSpacePanning = false;
    // controls.minDistance = 1000;
    // controls.maxDistance = 100000;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.rotateSpeed = 0.3;
    // controls.panSpeed = 0.3;

    // scene = new THREE.Scene();
    // this.scene = scene;
    // scene.background = new THREE.Color(0x16161d);
    // scene.add(new THREE.AmbientLight(0xa0a0a0));

    // this.selectControls = new SelectControls(
    //   scene,
    //   camera,
    //   renderer.domElement
    // );

    // var light = new THREE.SpotLight(0xffffff, 1.5);
    // light.position.set(0, 500, 2000);
    // light.angle = Math.PI / 9;
    // /*#light.castShadow = false;
    // 			light.shadow.camera.near = 1000;
    // 			light.shadow.camera.far = 4000;
    // 			light.shadow.mapSize.width = 1024;
    // 			light.shadow.mapSize.height = 1024;*/
    // // scene.add(light);

    // container.appendChild(renderer.domElement); // TODO //
    // /*    var dragControls = new THREE.DragControls(
    //     objects,
    //     camera,
    //     renderer.domElement
    //   );
    //   dragControls.addEventListener("dragstart", function() {
    //     controls.enabled = false;
    //   });
    //   dragControls.addEventListener("dragend", function() {
    //     controls.enabled = true;
    //   });

    //   dragControls.addEventListener("hoveron", function(event) {
    //     var object = data.objects[event.object.userData.id];
    //     var text = JSON.stringify(object, null, 2);
    //     document.getElementById("information").innerHTML = text;
    //   });*/ /*stats = new Stats();
    //   container.appendChild(stats.dom);*/ window.addEventListener(
    //   "resize",
    //   onWindowResize,
    //   false
    // );

    // animate();

    // function onWindowResize() {
    //   /*camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);*/
    // }
    // //
    // function animate() {
    //   requestAnimationFrame(animate);
    //   render();
    //   // stats.update(); // TODO
    // }
    // function render() {
    //   controls.update();
    //   // console.log('renderCalls: ' + renderer.info.render.calls)
    //   renderer.render(scene, camera);
    // }
  },
  methods: {
    ...mapActions(["loadData", "select"]),
    mouseDown(evt) {
      this.selectControls.onMouseDown(this, evt);
    },
    mouseMove(evt) {
      this.selectControls.onMouseMove(evt);
    },
    addCubes: function(data) {
      this.data = data;
      var colorMap = {};

      var size = 400; // 800 is size of foundations
      var geometry = new THREE.BoxBufferGeometry(size, size, size);

      for (var i = 0; i < data.objects.length; i++) {
        var obj = data.objects[i];
        if (obj.type == 1) {
          if (colorMap[obj.className] === undefined) {
            colorMap[obj.className] = Math.random() * 0xffffff;
          }

          var object = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({ color: colorMap[obj.className] })
          );
          object.position.x = obj.transform.translation[0];
          object.position.y = obj.transform.translation[1];
          object.position.z = obj.transform.translation[2];
          object.quaternion.x = obj.transform.rotation[0];
          object.quaternion.y = obj.transform.rotation[1];
          object.quaternion.z = obj.transform.rotation[2];
          object.quaternion.w = obj.transform.rotation[3];

          //object.rotation.x = Math.random() * 2 * Math.PI;
          //object.rotation.y = Math.random() * 2 * Math.PI;
          //object.rotation.z = Math.random() * 2 * Math.PI;

          var scaleMultiplier = 1;
          switch (obj.className) {
            case "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
              scaleMultiplier = 0.15;
              break;
          }
          // console.log(obj);

          object.scale.x = obj.transform.scale3d[0] * scaleMultiplier;
          object.scale.y = obj.transform.scale3d[1] * scaleMultiplier;
          object.scale.z = obj.transform.scale3d[2] * scaleMultiplier;
          object.castShadow = true;
          object.receiveShadow = true;

          object.userData = { id: i };
          this.scene.add(object);
          this.objects.push(object);
        }
      }
    }
  }
};
</script>
