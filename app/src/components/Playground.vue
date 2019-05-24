<template>
  <div
    class="scene"
    id="scene"
    tabindex="0"
    @mouseover="focusScene()"
    @mouseout="storeCameraState()"
    @keyup.l="setLocal(true)"
    @keyup.w="setLocal(false)"
    @keyup.g="setMode('translate')"
    @keyup.r="setMode('rotate')"
    @keyup.s="setMode('scale')"
    @keyup.f="focusSelectedObject()"
  >
    <ToolPanel
      :mode="mode"
      :local="local"
      @setLocal="setLocal(true)"
      @setWorld="setLocal(false)"
      @setTranslate="setMode('translate')"
      @setRotate="setMode('rotate')"
      @setScale="setMode('scale')"
    />

    <!--<button v-on:click="focusSelectedObject">Focus</button> -->
    <Renderer ref="renderer" :width="width" :height="height">
      <Scene ref="scene">
        <AmbientLight/>
        <Camera/>
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
      <br>
      {{ uuid }}
      <br>
      {{ commithash }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scene {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#glContainer {
  width: 100%;
  height: 100%;
}

.info {
  position: absolute;
  bottom: 0px;
  left: 0px;
  color: rgba(255, 255, 255, 0.4);
  padding: 5px;
  text-shadow: 1px 1px 1px #000;
  line-height: 1.1;
  font-size: 14px;
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
import { BoxBufferGeometry, LineCurve3, Mesh } from "three";
import { setTimeout } from "timers";
import { GLTFLoader } from "@/js/GLTFLoader";
import { modelHelper } from "@/helpers/modelHelper";
import { modelConfig } from "@/definitions/models";
import * as Sentry from "@sentry/browser";
import ToolPanel from "@/components/ToolPanel";
import { commithash } from "@/js/commithash";
import { getProperty, findActorByPathName } from "@/helpers/entityHelper";

export default {
  name: "Playground",
  components: {
    Renderer,
    Scene,
    Cube,
    Camera,
    AmbientLight,
    ToolPanel
  },
  data: function() {
    return {
      width: 100,
      height: 100,
      mode: "translate",
      local: false,
      commithash
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
    ...mapGetters(["getVisibleObjects"])
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
            this.getMaterial(window.data.objects[this.lastSelectedIndex])
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
    var textureLoader = new THREE.TextureLoader();
    this.matcap = textureLoader.load("textures/matcap-white.png", function(
      matcap
    ) {
      matcap.encoding = THREE.sRGBEncoding;
    });

    this.objects = [];
    this.invisibleObjects = [];
    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.loader = new GLTFLoader();
    this.materials = {};
    this.coloredMaterials = [];
    this.setupColoredMaterials();
    for (var prop in modelConfig) {
      this.materials[prop] = new THREE.MeshMatcapMaterial({
        color: modelConfig[prop].color,
        matcap: this.matcap
        /*emissive: modelConfig[prop].color,

        roughness: 0.6,
        metalness: .8,
        flatShading: true, // to not make the conveyor belt cylinders look to much like pipes*/
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

    var scene = this.$refs.scene.scene;

    /*var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-20000, 500, 20000);
    this.$refs.scene.scene.add(light);

    // darker light from the oposite direction to fake shadows?
    var light2 = new THREE.DirectionalLight(0xaaaaff, 0.3);
    light2.position.set(20000, -500, 20000);
    this.$refs.scene.scene.add(light2);*/

    this.transformControl = new TransformControls(
      this.$refs.renderer.camera.obj,
      this.$refs.renderer.renderer.domElement
    );
    this.transformControl.space = "world";
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

    // load map
    modelHelper.loadScene("/models/map.glb").then(model => {
      scene.add(model);
    });

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

    // setup to use the primary colors of painted buildings
    setupColoredMaterials() {
      const defaultColors = [
        new THREE.Color("#fcb26b"),
        new THREE.Color("#73a9d2"),
        new THREE.Color("#dd7550"),
        new THREE.Color("#666375"),

        new THREE.Color("#e1e1e9"),
        new THREE.Color("#bfe798"),
        new THREE.Color("#f890e2"),
        new THREE.Color("#bbf6ec"),

        new THREE.Color("#b59c5e"),
        new THREE.Color("#f9ecd9"),
        new THREE.Color("#c490f9"),
        new THREE.Color("#84dbb8"),

        new THREE.Color("#f5f09e"),
        new THREE.Color("#97978f"),
        new THREE.Color("#b048aa"),
        new THREE.Color("#838283")
      ];
      for (let i = 0; i < defaultColors.length; i++) {
        const color = defaultColors[i];

        // check the BuildableSubsystem -> mColorSlotsPrimary for changed colors
        const buildableSubsystem = findActorByPathName("Persistent_Level:PersistentLevel.BuildableSubsystem");
        if (buildableSubsystem !== undefined) {
          for (let i = 0; i < buildableSubsystem.entity.properties.length; i++) {
            const element = buildableSubsystem.entity.properties[i];
            if (element.name === "mColorSlotsPrimary") {
              // this primary color was changed by the user
              defaultColors[element.index] = new THREE.Color(
                element.value.r/255,
                element.value.g/255,
                element.value.b/255
              );
            }
          }
        }
        
        this.coloredMaterials[i] = new THREE.MeshMatcapMaterial({
          color: color,
          matcap: this.matcap
          //emissive: color,

          /*roughness: 0.6,
          metalness: 0.8,
          flatShading: true, // to not make the conveyor belt cylinders look to much like pipes*/
        });
      }
    },

    getMaterial(obj) {
      // mPrimaryColor attribute is no longer used, replaced with mColorSlot
      // if object contains property with name "mPrimaryColor"
      /*for (let i = 0; i < obj.entity.properties.length; i++) {
        const element = obj.entity.properties[i];
        if (element.name === "mPrimaryColor") {
          // generate material with this color

          const color = new THREE.Color(element.value.r, element.value.g, element.value.b);
          
          if (this.coloredMaterials[color.getHex()] === undefined) {
            console.log("new material: " + color.getHexString());
            this.coloredMaterials[color.getHex()] = new THREE.MeshStandardMaterial({
              color: color,
              emissive: color,

              roughness: 0.6,
              metalness: 0.8,
              flatShading: true, // to not make the conveyor belt cylinders look to much like pipes
            });
          }
          return this.coloredMaterials[color.getHex()];
        }
      }*/

      for (let i = 0; i < obj.entity.properties.length; i++) {
        const element = obj.entity.properties[i];
        if (element.name === "mColorSlot") {
          return this.coloredMaterials[element.value.unk2];
        }
      }

      if (obj.entity.properties)
        if (this.materials[obj.className] === undefined) {
          // fetch material based on class name
          // console.log(className);
          return this.materials["undefined"];
        } else {
          return this.materials[obj.className];
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
              this.getMaterial(obj)
              //new THREE.MeshLambertMaterial({ color: colorMap[obj.className] })
            );

            this.updateObjectVisuals(object, obj);

            object.userData = { id: i };
            this.$refs.scene.scene.add(object);
            this.objects.push(object);

            if (this.isConveyorLift(obj)) {
              // add other parts to conveyor lift
              
              modelHelper
                .loadModel("/models/ConveyorLift_Top.glb")
                .then(geometry => {
                  var topObject = new THREE.Mesh(
                    geometry,
                    this.getMaterial(obj)
                  );

                  var topPartTranslationZ = 0;

                  for (let i = 0; i < obj.entity.properties.length; i++) {
                    const element = obj.entity.properties[i];
                    if (element.name === "mTopTransform") {
                      for (let i = 0; i < element.value.properties.length; i++) {
                        const elem = element.value.properties[i];
                        if (elem.name === "Rotation") {
                          this.applyRotation(topObject, [elem.value.a, elem.value.b, elem.value.c, elem.value.d]);
                        } else if (elem.name === "Translation") {
                          this.applyTranslation(topObject, [elem.value.x, elem.value.y, elem.value.z]);
                          topPartTranslationZ = elem.value.z;
                        }
                      }
                    }
                  }

                  object.add(topObject);


                  // Fake the middle part of the conveyor lift
                  const middleGeometry = new THREE.BoxBufferGeometry(38, 198, topPartTranslationZ > 0 ? topPartTranslationZ: - topPartTranslationZ);
                  var middleObject = new THREE.Mesh(
                    middleGeometry,
                    this.getMaterial(obj)
                  );
                  middleObject.position.z = topPartTranslationZ / 2;
                  object.add(middleObject);
                  

              });
            }
          });
        }
      }
    },

    createConveyorBeltGeometry(obj) {
      const translation = obj.transform.translation;
      const splineData = obj.entity.properties[0]; // TODO actually search for mSplineData as it might not be the first

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
      var length = 38, width = 200;
      var shape = new THREE.Shape();
      shape.moveTo( -length/2,-width/2 );
      shape.lineTo( -length/2, width/2 );
      shape.lineTo( length/2, width/2 );
      shape.lineTo( length/2, -width/2 );
      shape.lineTo( -length/2, -width/2 );


      var extrudeSettings = {
        steps: splinePoints,
        bevelEnabled: false,
        extrudePath: extrudePath
      };

      const geometry = new THREE.ExtrudeBufferGeometry(
        shape,
        extrudeSettings,
/*        extrusionSegments,
        radius,
        radiusSegments,
        closed*/
      );

      /*const mesh = new THREE.Mesh(geometry, this.unselectedMaterial);
      mesh.position.x = obj.transform.translation[1];
      mesh.position.y = obj.transform.translation[0];
      mesh.position.z = obj.transform.translation[2]
      this.$refs.scene.scene.add(mesh);*/
      return geometry;
    },

    applyTranslation(object, translation) {
      // switched around to convert from Unreal coordinate system (XYZ left-handed) to three.js coordinate system (XZY right-handed)
      object.position.x = translation[1];
      object.position.y = translation[0];
      object.position.z = translation[2];
    },

    applyRotation(object, rotation) {
      object.quaternion.x = rotation[0];
      object.quaternion.y = rotation[1];
      object.quaternion.z = -rotation[2];
      object.quaternion.w = rotation[3];
    },

    applyScale(object, scale) {
      // TODO are those on the correct axes? Or do the need to be switched like the positions
      object.scale.x = scale[0];
      object.scale.y = scale[1];
      object.scale.z = scale[2];
    },

    updateObjectVisuals(object, obj) {
      // console.log(obj);
      this.applyTranslation(object, obj.transform.translation);
      this.applyRotation(object, obj.transform.rotation);

      if (!this.isConveyorBelt(obj)) {
        object.rotateZ(1.5708); // 90 deg in radians
      } // TODO conveyor belt coordinates are given without rotation?

      this.applyScale(object, obj.transform.scale3d);
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
    storeCameraState() {
      this.$refs.renderer.camera.updateCameraState();
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

      if (!this.isConveyorBelt(this.selectedObject)) {
        obj.rotateZ(-1.5708); // -90 deg in radians
      } // TODO conveyor belt coordinates are given without rotation?
      clone.transform.rotation[0] = obj.quaternion.x;
      clone.transform.rotation[1] = obj.quaternion.y;
      clone.transform.rotation[2] = -obj.quaternion.z;
      clone.transform.rotation[3] = obj.quaternion.w;

      clone.transform.scale3d[0] = obj.scale.x;
      clone.transform.scale3d[1] = obj.scale.y;
      clone.transform.scale3d[2] = obj.scale.z;

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

    isConveyorLift(obj) {
      return (obj.className === "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C" ||
      obj.className === "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C" ||
      obj.className === "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C" ||
      obj.className === "/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C");
    },

    getGeometry(obj) {
      var className = obj.className;

      return new Promise((resolve, reject) => {
        // special cases for geometry
        if (this.isConveyorBelt(obj)) {
          resolve(this.createConveyorBeltGeometry(obj));
          return;
        }
        if (obj.className === "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C") { // Conveyor Pole
          const poleMesh = getProperty(obj, "mPoleMesh");
          if (poleMesh !== undefined) {
            switch(poleMesh.value.pathName) {
              case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_01_static.ConveyorPole_01_static":
                break;
              case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_02_static.ConveyorPole_02_static":
                className = "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_2";
                break;
              case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_03_static.ConveyorPole_03_static":
                className = "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_3";
                break;
              case "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_04_static.ConveyorPole_04_static":
                className = "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_4";
                break;
            }
          }
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
    },

    // transform control
    setLocal(local) {
      this.local = local;
      if (local) {
        this.transformControl.space = "local";
      } else {
        this.transformControl.space = "world";
      }
    },

    setMode(mode) {
      this.mode = mode;
      this.transformControl.mode = mode;
    },

    focusScene() {
      // focus the scene div so no text fields get key inputs
      // needs a tabindex on the div, see https://stackoverflow.com/a/3656524
      document.getElementById("scene").focus();
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
