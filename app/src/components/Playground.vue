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
import { BoxBufferGeometry, LineCurve3 } from "three";
import { setTimeout } from "timers";
import { GLTFLoader } from "@/js/GLTFLoader";
import { modelHelper } from "@/helpers/modelHelper";
import { modelConfig } from "@/definitions/models";
import * as Sentry from "@sentry/browser";

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
        if (this.lastSelectedIndex >= 0) {
          //  && this.lastSelectedIndex < this.objects.length
          this.setMaterial(
            this.lastSelectedIndex,
            this.getMaterial(
              window.data.objects[this.lastSelectedIndex].className
            )
          );
        }
        this.lastSelectedIndex = val;
        if (val >= 0) {
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

    this.loader = new GLTFLoader();
    this.materials = {};
    for (var prop in modelConfig) {
      this.materials[prop] = new THREE.MeshLambertMaterial({
        color: modelConfig[prop].color
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
    this.transformControl.space = "local";
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

          this.getGeometry(obj).then(geometry => {
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

    createConveyorBeltGeometry(obj) {
      const translation = obj.transform.translation;
      const splineData = obj.entity.properties[0]; // TODO actually search for mSplineData as it might not be the first
      console.log(splineData);

      const splinePoints = splineData.value.values.length;

      const extrusionSegments = splinePoints;
      const radius = 100;
      const radiusSegments = 3;
      const closed = false;

      const points = [];

      const extrudePath = new THREE.CurvePath(); //new THREE.CatmullRomCurve3(points);

      var lastOut = null;
      var lastLoc = null;

      for (let i = 0; i < splinePoints; i++) {
        const splinePoint = splineData.value.values[i];
        const location = splinePoint.properties[0]; // TODO make sure this is Location
        const arriveTangent = splinePoint.properties[0]; // TODO make sure this is arriveTangent
        const leaveTangent = splinePoint.properties[0]; // TODO make sure this is leaveTangent
        points.push(
          new THREE.Vector3(
            arriveTangent.value.y,
            arriveTangent.value.x,
            arriveTangent.value.z
          )
        );
        points.push(
          new THREE.Vector3(
            location.value.y,
            location.value.x,
            location.value.z
          )
        );

        points.push(
          new THREE.Vector3(
            leaveTangent.value.y,
            leaveTangent.value.x,
            leaveTangent.value.z
          )
        );

        if (lastOut != null) {
          extrudePath.add(
            new LineCurve3(
              new THREE.Vector3(
                lastLoc.value.y,
                lastLoc.value.x,
                lastLoc.value.z
              ),
              new THREE.Vector3(
                location.value.y,
                location.value.x,
                location.value.z
              )
            )
          );
          // TODO find out how exactly to use arriveTangent and leaveTangent
          /*extrudePath.add(
            new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(
                lastLoc.value.y, 
                lastLoc.value.x, 
                lastLoc.value.z),
                new THREE.Vector3(
                lastOut.value.y, 
                lastOut.value.x, 
                lastOut.value.z),
              new THREE.Vector3(
                arriveTangent.value.y, 
                arriveTangent.value.x, 
                arriveTangent.value.z),
              new THREE.Vector3(
                location.value.y, 
                location.value.x, 
                location.value.z)
            )
          );*/
        }

        lastOut = leaveTangent;
        lastLoc = location;
      }

      // const extrudePath2 = new THREE.CatmullRomCurve3(points);

      const geometry = new THREE.TubeBufferGeometry(
        extrudePath,
        extrusionSegments,
        radius,
        radiusSegments,
        closed
      );

      /*const mesh = new THREE.Mesh(geometry, this.unselectedMaterial);
      mesh.position.x = obj.transform.translation[1];
      mesh.position.y = obj.transform.translation[0];
      mesh.position.z = obj.transform.translation[2]
      this.$refs.scene.scene.add(mesh);*/
      return geometry;
    },

    updateObjectVisuals(object, obj) {
      // console.log(obj);

      // switched around to convert from Unreal coordinate system (XYZ left-handed) to three.js coordinate system (XZY right-handed)
      object.position.x = obj.transform.translation[1];
      object.position.y = obj.transform.translation[0];
      object.position.z = obj.transform.translation[2];
      object.quaternion.x = obj.transform.rotation[0];
      object.quaternion.y = obj.transform.rotation[1];
      object.quaternion.z = -obj.transform.rotation[2];
      object.quaternion.w = obj.transform.rotation[3];

      if (!this.isConveyorBelt(obj)) {
        object.rotateZ(1.5708); // 90 deg in radians
      } // TODO conveyor belt coordinates are given without rotation?

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
        // changed because of coordinate system change
        camera.target.x = obj.transform.translation[1];
        camera.target.y = obj.transform.translation[0];
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
      // switched to accord for coordinate system change!
      clone.transform.translation[1] = obj.position.x;
      clone.transform.translation[0] = obj.position.y;
      clone.transform.translation[2] = obj.position.z;

      console.log("clone: " + clone);
      this.setSelectedObject(clone);
    },

    isConveyorBelt(obj) {
      return (
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C" ||
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C" ||
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C" ||
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C" ||
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C" ||
        obj.className ===
          "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C"
      );
    },

    getGeometry(obj) {
      const className = obj.className;

      return new Promise((resolve, reject) => {
        if (this.isConveyorBelt(obj)) {
          resolve(this.createConveyorBeltGeometry(obj));
          return;
        }

        if (this.geometries[className] === undefined) {
          if (
            modelConfig[className] !== undefined &&
            modelConfig[className].model !== ""
          ) {
            modelHelper
              .loadModel("/models/" + modelConfig[className].model)
              .then(geometry => {
                this.geometries[className] = geometry;
                resolve(this.geometries[className]);
              });
          } else {
            if (modelConfig[className] === undefined) {
              console.error("missing model definition: " + className);
              Sentry.captureMessage("missing model definition: " + className);
            }

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
