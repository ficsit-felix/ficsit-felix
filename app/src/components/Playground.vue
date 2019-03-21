<template>
  <div class="scene" id="scene">
    <!--<button v-on:click="focusSelectedObject">Focus</button> -->
    <Renderer ref="renderer" :width="width" :height="height">
      <Scene ref="scene">
        <AmbientLight />
        <Camera />
        <!--<a v-for="(obj,index) in visibleObjects"
          :key="index">
          
        <Cube
          v-if="obj.state === 0"
          :object="obj"
          :geometry="geometry"
          :material="unselected"
        />
        <Cube
          v-else
          :object="obj"
          :geometry="geometry"
          :material="selected"
        />
        </a>-->
      </Scene>
    </Renderer>
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
    <div class="info">
      {{ filename }}
      <br />
      {{ uuid }}
    </div>
  </div>
</template>

<style lang="scss">
.scene {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#glContainer {
  width: 100%;
  height: 100%;
}

.info {
  position: absolute;
  bottom: 0px;
  left: 0px;
  color: rgba(255, 255, 255, 0.6);
  padding: 5px;
  text-shadow: 1px 1px 1px #000;
}
</style>

<script>
import * as THREE from "three";
import { OrbitControls } from "@/js/OrbitControls";
import { SelectControls } from "@/js/SelectControls";
import { TransformControls } from "@/js/TransformControls";
import { mapActions, mapGetters, mapState } from "vuex";
import Scene from "@/components/scene/Scene";
import Renderer from "@/components/scene/Renderer";
import Cube from "@/components/scene/Cube";
import Camera from "@/components/scene/Camera";
import AmbientLight from "@/components/scene/AmbientLight";
import { BoxBufferGeometry } from "three";
import { setTimeout } from "timers";
import { GLTFLoader } from "@/js/GLTFLoader";
import { modelHelper} from "@/helpers/modelHelper";

export default {
  name: "Playground",
  components: {
    Renderer,
    Scene,
    Cube,
    Camera,
    AmbientLight
  },
  data: function() {
    return {
      width: 100,
      height: 100
    };
  },
  computed: {
    ...mapState([
      "selectedIndex",
      "dataLoaded",
      "uuid",
      "filename",
      "classes",
      "selectedObject"
    ]),
    ...mapGetters(["getVisibleObjects"]),

    geometry() {
      return new BoxBufferGeometry(400, 400, 400); // TODO only create one shared geometry
    },
    unselected() {
      return new THREE.MeshLambertMaterial({ color: 0xcccccc });
    },
    selected() {
      return new THREE.MeshLambertMaterial({ color: 0xdc904f });
    }
  },
  watch: {
    dataLoaded(val) {
      if (val) {
        this.addCubes();
      }
    },
    selectedIndex(val) {
      if (val != this.lastSelectedIndex) {
        if (this.lastSelectedIndex != -1) {
          //  && this.lastSelectedIndex < this.objects.length
          this.setMaterial(
            this.lastSelectedIndex,
            this.getMaterial(
              window.data.objects[this.lastSelectedIndex].className
            )
          );
        }
        this.lastSelectedIndex = val;
        if (val != -1) {
          //  && val < this.objects.length
          this.setMaterial(val, this.selectedMaterial);
          var obj = this.getVisibleObjWithId(val);
          if (obj != null) {
            this.transformControl.attach(obj);
          } else {
            this.transformControl.detach();
          }
        } else {
          this.transformControl.detach();
        }
      }
    },
    selectedObject(val) {
      if (val !== null) {
        var obj = this.getObjWithId(this.selectedIndex);
        if (obj !== null) {
          this.updateObjectVisuals(obj, val);
        }
      }
    },
    classes: {
      deep: true,
      handler(val) {
        for (var i = 0; i < val.length; i++) {
          const item = val[i];
          if (item.visible) {
            // make invisible objects visible again
            for (var j = this.invisibleObjects.length - 1; j >= 0; j--) {
              const obj = this.invisibleObjects[j];

              if (
                window.data.objects[obj.userData.id].className === item.name
              ) {
                this.$refs.scene.scene.add(obj);
                this.invisibleObjects.splice(j, 1);
                this.objects.push(obj);
              }
            }
          } else {
            for (var j = this.objects.length - 1; j >= 0; j--) {
              const obj = this.objects[j];

              if (
                window.data.objects[obj.userData.id].className === item.name
              ) {
                this.$refs.scene.scene.remove(obj);
                this.objects.splice(j, 1);
                this.invisibleObjects.push(obj);
              }
            }
          }
        }

        // fix transform helper
        var obj = this.getVisibleObjWithId(this.selectedIndex);
        if (obj == null) {
          this.transformControl.detach();
        } else {
          this.transformControl.attach(obj);
        }
      }
    }
  },

  mounted() {
    this.objects = [];
    this.invisibleObjects = [];
    this.unselectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc
    });
    this.selectedMaterial = new THREE.MeshLambertMaterial({
      color: 0xdc904f,
      emissive: 0xdc904f
    });

    // create materials
    const colors = {
      // stones and materials (gray)
      "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleLargeRock.BP_DestructibleLargeRock_C": 0xaaaaaa,
      "/Game/FactoryGame/Equipment/C4Dispenser/BP_DestructibleSmallRock.BP_DestructibleSmallRock_C": 0x777777,
      "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C": 0x444444,
      "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C": 0x333333,

      // creatures (red)
      "/Game/FactoryGame/Character/Creature/BP_CreatureSpawner.BP_CreatureSpawner_C": 0xef1d1d,
      "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_CrabEggParts.BP_CrabEggParts_C": 0xbd6e41,
      "/Game/FactoryGame/Resource/Environment/AnimalParts/BP_HogParts.BP_HogParts_C": 0xa93c2c,
      "/Game/FactoryGame/Character/Creature/Enemy/Hog/Char_Hog.Char_Hog_C": 0xd80e2c,
      "/Game/FactoryGame/Character/Creature/Enemy/Spitter/SmallSpitter/Char_Spitter_Small.Char_Spitter_Small_C": 0xda3950,
      "/Game/FactoryGame/Character/Creature/Wildlife/NonFlyingBird/Char_NonFlyingBird.Char_NonFlyingBird_C": 0xbc0f28,
      "/Game/FactoryGame/Character/Creature/Wildlife/SpaceGiraffe/Char_SpaceGiraffe.Char_SpaceGiraffe_C": 0xc20f0f,

      // nature (green)
      "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C": 0x43d854,
      "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C": 0x2dba20,
      "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C": 0x08850e,
      "/Game/FactoryGame/Resource/BP_ResourceNodeGeyser.BP_ResourceNodeGeyser_C": 0x3caa74,
      // player (blue)
      "/Game/FactoryGame/Character/Player/BP_DeathMarker.BP_DeathMarker_C": 0x3a5eff,
      "/Game/FactoryGame/-Shared/Crate/BP_Crate.BP_Crate_C": 0x0c2a89,
      "/Game/FactoryGame/Equipment/Chainsaw/Equip_Chainsaw.Equip_Chainsaw_C": 0x0c2889,
      "/Game/FactoryGame/Equipment/RebarGun/Equip_RebarGun_Projectile.Equip_RebarGun_Projectile_C": 0x0c2289,
      "/Game/FactoryGame/Equipment/ColorGun/Equip_ColorGun.Equip_ColorGun_C": 0x0c1289,
      "/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C": 0x001dff,
      "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C": 0x4157bd,

      // buildings (purple)
      "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C": 0x3c21c0,
      "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C": 0x6042d5,
      "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C": 0x5549bf,
      "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C": 0x5c3ba5,
      "/Game/FactoryGame/Buildable/Factory/Workshop/Build_Workshop.Build_Workshop_C": 0x310c89,
      "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBench.Build_WorkBench_C": 0x472596,
      "/Game/FactoryGame/Buildable/Factory/Mam/Build_MamIntegrated.Build_MamIntegrated_C": 0x4e2596,
      "/Game/FactoryGame/Buildable/Factory/WorkBench/Build_WorkBenchIntegrated.Build_WorkBenchIntegrated_C": 0x543a83,
      "/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C": 0x693fb2,
      "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayStraight.Build_WalkwayStraight_C": 0x7337c6,
      "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayRamp.Build_WalkwayRamp_C": 0x6b29aa,
      "/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayCross.Build_WalkwayCross_C": 0x7c25ce,
      "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set02/Build_Wall_2a.Build_Wall_2a_C": 0x9525ce,
      "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1a.Build_Wall_1a_C": 0xab51d8,
      "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_02.Build_Wall_Door_8x4_02_C": 0xcc81e3,
      "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03.Build_Wall_Conveyor_8x4_03_C": 0xc658e6,
      "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01.Build_Wall_Conveyor_8x4_01_C": 0xb714e8,
      "/Game/FactoryGame/Buildable/Building/Wall/Wall_Set01/Build_Wall_1c.Build_Wall_1c_C": 0xc514e8,
      "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C": 0xcb4ae4,
      "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C": 0xd682e7,
      "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C": 0xac74b7,
      "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C": 0x8d6096,
      "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C": 0x894896,
      "/Game/FactoryGame/Buildable/Factory/JumpPad/Build_JumpPad.Build_JumpPad_C": 0x872f98,
      "/Game/FactoryGame/Buildable/Factory/LookoutTower/Build_LookoutTower.Build_LookoutTower_C": 0x811396,
      "/Game/FactoryGame/Buildable/Factory/TradingPost/Build_TradingPost.Build_TradingPost_C": 0x710586,
      "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C": 0x5d046e,
      "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StoragePlayer.Build_StoragePlayer_C": 0x450352,
      "/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageIntegrated.Build_StorageIntegrated_C": 0x502459,
      "/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C": 0xcb43be,
      "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C": 0xac139e,
      "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass.Build_GeneratorBiomass_C": 0xaa3da0,
      "/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorIntegratedBiomass.Build_GeneratorIntegratedBiomass_C": 0x91498a,
      "/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C": 0x8b2f82,
      "/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C": 0x830477,
      "/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C": 0x63075a,
      "/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C": 0x41063c,
      "/Game/FactoryGame/Buildable/Factory/CA_Splitter/Build_ConveyorAttachmentSplitter.Build_ConveyorAttachmentSplitter_C": 0x5f1c59,
      "/Game/FactoryGame/Buildable/Factory/CA_Merger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C": 0x693d65,
      "/Game/FactoryGame/Equipment/Beacon/BP_Beacon.BP_Beacon_C": 0xa80cff,
      "/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C": 0x7f28b0,

      // items (cyan)
      "/Script/FactoryGame.FGItemPickup_Spawnable": 0x51d5e4,

      // specials (yellow)
      "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C": 0xc7b317,
      "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C": 0xdccc4e,
      "/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C": 0xe4da51,
      "/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C": 0xaa5e2f,
      "/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C": 0x963f1e,
      "/Game/FactoryGame/World/Benefit/DropPod/BP_DropPod.BP_DropPod_C": 0xfffd00,

      // ??? (pink)
      "/Script/FactoryGame.FGFoliageRemoval": 0x721884,
      undefined: 0xff00ff
    };

    this.loader = new GLTFLoader();
    this.materials = {};
    for (var prop in colors) {
      this.materials[prop] = new THREE.MeshLambertMaterial({
        color: colors[prop]
      });
    }
    this.geometries = {};

    this.lastSelectedIndex = -1;
    if (this.dataLoaded) {
      this.addCubes();
    } else {
      // load the data
      // should not happen anymore
      /*this.loadData()
        .then(response => {
          console.log(this);
          //     this.addCubes(response);
        })
        .catch(err => {
          console.error(err);
        });*/
    }
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

    var scene = this.$refs.scene.scene;

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-200, 500, 2000);
    this.$refs.scene.scene.add(light);

    // darker light from the oposite direction to fake shadows?
    var light2 = new THREE.DirectionalLight(0xaaaaff, 0.3);
    light2.position.set(200, -500, -2000);
    this.$refs.scene.scene.add(light2);

    this.transformControl = new TransformControls(
      this.$refs.renderer.camera.obj,
      this.$refs.renderer.renderer.domElement
    );
    // correct way to to this, but i don't want that many updates
    /*this.transformControl.addEventListener('objectChange', () => {
      this.objectChanged();
    })*/
    this.transformControl.addEventListener("dragging-changed", event => {
      this.$refs.renderer.selectControls.disabled = event.value;
      if (event.value == false) {
        this.objectChanged();
      }
    });
    this.$refs.scene.scene.add(this.transformControl);
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
    //   renderer.render(scene, camera); asdf
    // }

    // listen to window resize
    window.addEventListener("resize", this.handleResize);
    window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere
  },
  methods: {
    ...mapActions(["loadData", "setSelectedObject"]),

    getMaterial(className) {
      if (this.materials[className] === undefined) {
        // console.log(className);
        return this.materials["undefined"];
      } else {
        return this.materials[className];
      }
    },
    setMaterial(id, material) {
      for (var i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i];
        if (obj.userData.id === id) {
          obj.material = material;
          return;
        }
      }
      for (var i = 0; i < this.invisibleObjects.length; i++) {
        const obj = this.invisibleObjects[i];
        if (obj.userData.id === id) {
          obj.material = material;
          return;
        }
      }
      // console.error("No object found with id " + id);
    },
    getObjWithId(id) {
      for (var i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i];
        if (obj.userData.id === id) {
          return obj;
        }
      }
      for (var i = 0; i < this.invisibleObjects.length; i++) {
        const obj = this.invisibleObjects[i];
        if (obj.userData.id === id) {
          return obj;
        }
      }
      return null;
    },
    getVisibleObjWithId(id) {
      for (var i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i];
        if (obj.userData.id === id) {
          return obj;
        }
      }
      return null;
    },
    addCubes: function() {
      var colorMap = {};

      var size = 400; // 800 is size of foundations
      var geometry = new THREE.BoxBufferGeometry(size, size, size);

      // needs to be a let, so that we can access i in the lambda function further down
      for (let i = 0; i < window.data.objects.length; i++) {
        let obj = window.data.objects[i];
        if (obj.type == 1) {
          if (colorMap[obj.className] === undefined) {
            colorMap[obj.className] = Math.random() * 0xffffff;
          }

          this.getGeometry(obj.className).then(geometry => {
            var object = new THREE.Mesh(
              geometry,
              this.getMaterial(obj.className)
              //new THREE.MeshLambertMaterial({ color: colorMap[obj.className] })
            );

            this.updateObjectVisuals(object, obj);

            object.userData = { id: i };
            this.$refs.scene.scene.add(object);
            this.objects.push(object);
          });
        }
      }
    },

    updateObjectVisuals(object, obj) {
      // console.log(obj);
      object.position.x = obj.transform.translation[0];
      object.position.y = obj.transform.translation[1];
      object.position.z = obj.transform.translation[2];
      object.quaternion.x = obj.transform.rotation[0];
      object.quaternion.y = obj.transform.rotation[1];
      object.quaternion.z = obj.transform.rotation[2];
      object.quaternion.w = obj.transform.rotation[3];

      var scaleMultiplier = [1, 1, 1];
      /*switch (obj.className) {
        case "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
          scaleMultiplier = [0.15, 0.15, 0.15];
          break;
        case "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C":
          // scaleMultiplier = [2, 2, 0.25];
          break;
      }*/
      // console.log(obj);

      object.scale.x = obj.transform.scale3d[0] * scaleMultiplier[0];
      object.scale.y = obj.transform.scale3d[1] * scaleMultiplier[1];
      object.scale.z = obj.transform.scale3d[2] * scaleMultiplier[2];
    },
    focusSelectedObject() {
      var camera = this.$refs.renderer.camera.controls;
      var obj = window.data.objects[this.selectedIndex];
      if (obj.type === 1) {
        camera.target.x = obj.transform.translation[0];
        camera.target.y = obj.transform.translation[1];
        camera.target.z = obj.transform.translation[2];
      }
    },

    handleResize() {
      // console.log("resize", this.$refs.renderer);
      var elem = document.getElementById("scene");
      if (elem === undefined || elem === null) {
        return;
      }
      var width = elem.offsetWidth;
      var height = elem.offsetHeight;
      this.width = width;
      this.height = height;
    },
    objectChanged() {
      var obj = this.getObjWithId(this.selectedIndex);

      // TODO need to clone, else change is not detected?
      // find more intelligent way
      var clone = Object.assign({}, this.selectedObject);
      clone.transform.translation[0] = obj.position.x;
      clone.transform.translation[1] = obj.position.y;
      clone.transform.translation[2] = obj.position.z;

      console.log("clone: " + clone);
      this.setSelectedObject(clone);
    },

    getGeometry(className) {
      return new Promise((resolve, reject) => {
        if (this.geometries[className] === undefined) {
          var models = {
            "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C":
              "Build_Foundation_8x2_01_C.glb",
            "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C":
              "Build_StorageContainerMk1_C.glb",
            "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
              "BP_ResourceNode_C.glb",
            "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C":
              "BP_ResourceDeposit_C.glb",
            "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C":
              "Build_Stairs_Left_01_C.glb", // rotate z 180 z+100
            "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C":
              "Build_Wall_1a_C.glb",
            "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C":
              "Build_Ramp_8x4_01_C.glb", // z -200
            "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C":
              "Build_Foundation_8x4_01_C.glb", // z -200
            "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C":
              "BP_VehicleTargetPoint_C.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C":
              "Build_ConveyorPole_C.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C":
              "Build_ConveyorBelt.glb",
            "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C":
              "BP_NutBush_C.glb",
            "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C":
              "BP_Shroom_01_C.glb",
            "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C":
              "BP_BerryBush_C.glb",
            "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C":
              "Build_PowerPoleMk1_C.glb",
            "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C":
              "Build_PowerLine_C.glb",
            "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C":
              "Build_MinerMk1_C.glb" // r z 180
          };

          if (models[className] !== undefined) {

            modelHelper.loadModel(
              "/models/" + models[className]
            ).then((geometry) => {
                this.geometries[className] = geometry;
                resolve(this.geometries[className]);
              }
            );
          } else {
            var size = 400; // 800 is size of foundations
            var geometry = new THREE.BoxBufferGeometry(size, size, size);
            this.geometries[className] = geometry;
            resolve(this.geometries[className]);
          }
        } else {
          resolve(this.geometries[className]);
        }
      });
    }
  }, // END OF METHODS

  beforeDestroy() {
    this.transformControl.detach();
    this.transformControl.dispose();
    window.removeEventListener("resize", this.handleResize);
    for (var i = 0; i < this.objects.length; i++) {
      this.$refs.scene.scene.remove(this.objects[i]);
    }
  }
};
</script>
