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
    <Toolbar
      :mode="mode"
      :local="local"
      @setLocal="setLocal(true)"
      @setWorld="setLocal(false)"
      @setTranslate="setMode('translate')"
      @setRotate="setMode('rotate')"
      @setScale="setMode('scale')"
    />

    <Renderer ref="renderer" :width="width" :height="height">
      <Scene ref="scene">
        <AmbientLight />
        <Camera @cameraChange="updateCompass" />
      </Scene>
    </Renderer>

    <div class="info">
      {{ filename }}
      <br />
      {{ uuid }}
      <br />
      {{ commithash }}
    </div>
    <Compass :rotateX="rotateX" :rotateZ="rotateZ"></Compass>
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
import Camera from "@/components/scene/Camera";
import AmbientLight from "@/components/scene/AmbientLight";
import { BoxBufferGeometry, LineCurve3, Mesh, error } from "three";
import { setTimeout } from "timers";
import { GLTFLoader } from "@/js/GLTFLoader";
import { modelHelper } from "@/helpers/modelHelper";
import { modelConfig } from "@/definitions/models";
import * as Sentry from "@sentry/browser";
import Toolbar from "@/components/Toolbar";
import { commithash } from "@/js/commithash";
import { getProperty, findActorByName } from "@/helpers/entityHelper";
import { version } from "punycode";
import Compass from "@/components/Compass";
import { ConveyorCurvePath } from "@/js/ConveyorCurvePath";
import GeometryFactory from "@/graphics/GeometryFactory";
import MaterialFactory from "@/graphics/MaterialFactory";
import {
  isConveyorBelt,
  isConveyorLift,
  isPowerLine
} from "../helpers/entityHelper";

export default {
  name: "Playground",
  components: {
    Renderer,
    Scene,
    Camera,
    AmbientLight,
    Toolbar,
    Compass
  },
  data: function() {
    return {
      width: 100,
      height: 100,
      mode: "translate",
      local: false,
      commithash,
      rotateX: 0,
      rotateZ: 0
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
    ...mapState("settings", [
      "showCustomPaints",
      "showModels",
      "showMap",
      "conveyorBeltResolution",
      "classColors"
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
            this.materialFactory.createMaterial(
              window.data.objects[this.lastSelectedIndex]
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
    },

    showCustomPaints(value) {
      this.materialFactory.showCustomPaints = value;
      // update materials
      this.updateAllMaterials();
    },

    showModels(value) {
      this.geometryFactory.showModels = value;
      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const obj = window.data.objects[object.userData.id];

        // TODO should we dispose of the old models? or keep them in case the user changes the setting again
        this.geometryFactory
          .getGeometry(obj)
          .then(geometry => (object.geometry = geometry));
        //scene.add(object);
      }
    },
    conveyorBeltResolution(value) {
      this.geometryFactory.conveyorBeltResolution = value;
      if (!this.showModels) {
        // Conveyor belts are not displayed
        return;
      }
      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const obj = window.data.objects[object.userData.id];

        object.geometry.dispose();
        // TODO here we should certainly dispose of the old conveyor belts
        if (isConveyorBelt(obj)) {
          this.geometryFactory
            .createGeometry(obj)
            .then(geometry => (object.geometry = geometry));
        }
        //scene.add(object);
      }
    },
    showMap(value) {
      if (value) {
        this.loadMap();
      } else {
        if (this.mapModel !== undefined) {
          var scene = this.$refs.scene.scene;
          scene.remove(this.mapModel);
        }
      }
    },
    classColors: {
      deep: true,
      handler(value) {
        this.materialFactory.setupDefaultMaterials();
        this.updateAllMaterials();
      }
    }
  },

  mounted() {
    this.geometryFactory = new GeometryFactory(
      this.showModels,
      this.conveyorBeltResolution
    );

    var textureLoader = new THREE.TextureLoader();
    this.matcap = textureLoader.load("textures/matcap-white.png", function(
      matcap
    ) {
      matcap.encoding = THREE.sRGBEncoding;
    });

    this.materialFactory = new MaterialFactory(
      this.matcap,
      this.showCustomPaints
    );

    this.objects = [];
    this.invisibleObjects = [];
    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.loader = new GLTFLoader();

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
    if (this.showMap) {
      this.loadMap();
    }

    // listen to window resize
    window.addEventListener("resize", this.handleResize);
    window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere
  },
  methods: {
    ...mapActions(["loadData", "setSelectedObject"]),

    updateCompass() {
      // TODO move to a onCameraChanged to only update when necessary
      const camera = this.$refs.renderer.camera.obj;
      var position = new THREE.Vector3();
      var quaternion = new THREE.Quaternion();
      var scale = new THREE.Vector3();

      camera.matrixWorldInverse.decompose(position, quaternion, scale);
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      this.rotateX = euler.x;
      this.rotateZ = -euler.z - 3.14 / 2; // point correctly to north
      if (this.rotateX < -1.3) {
        // don't go invisible at very small angle to map
        this.rotateX = -1.3;
      }
    },

    loadMap() {
      var scene = this.$refs.scene.scene;
      if (this.mapModel === undefined) {
        modelHelper.loadScene("/models/map.glb").then(model => {
          this.mapModel = model;
          if (this.showMap) {
            scene.add(model);
          }
        });
      } else {
        if (this.showMap) {
          scene.add(this.mapModel);
        } else {
          scene.remove(this.mapModel);
        }
      }
    },

    setMaterial(id, material) {
      for (var i = 0; i < this.objects.length; i++) {
        const obj = this.objects[i];
        if (obj.userData.id === id) {
          obj.material = material;
          for (let i = 0; i < obj.children.length; i++) {
            const element = obj.children[i];
            element.material = material;
          }
          return;
        }
      }
      for (var i = 0; i < this.invisibleObjects.length; i++) {
        const obj = this.invisibleObjects[i];
        if (obj.userData.id === id) {
          obj.material = material;
          for (let i = 0; i < obj.children.length; i++) {
            const element = obj.children[i];
            element.material = material;
          }
          return;
        }
      }
      // console.error("No object found with id " + id);
    },

    updateAllMaterials() {
      // TODO should keep the selected material?
      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const obj = window.data.objects[object.userData.id];
        const material = this.materialFactory.createMaterial(obj);
        object.material = material;
      }
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

          if (isConveyorLift(obj)) {
            this.addConveyorLift(obj, i);
            continue;
          }

          this.geometryFactory.createGeometry(obj).then(geometry => {
            var object = new THREE.Mesh(
              geometry,
              this.materialFactory.createMaterial(obj)
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

    addConveyorLift(obj, index) {
      // add other parts to conveyor lift
      modelHelper
        .loadModel("/models/ConveyorLift_Bottom.glb")
        .then(bottomGeometry => {
          modelHelper
            .loadModel("/models/ConveyorLift_Top.glb")
            .then(topGeometry => {
              const material = this.materialFactory.createMaterial(obj);
              // const isReversedProp = getProperty(obj, "mIsReversed");
              // const isReversed = isReversedProp !== undefined && isReversedProp.value;

              // if the role of top and bottom are reversed does not seem to depend on the mIsReversed property, but on the sign of the z coordinate of the translation
              var topPartTranslationZ = 0;
              for (let i = 0; i < obj.entity.properties.length; i++) {
                const element = obj.entity.properties[i];
                if (element.name === "mTopTransform") {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === "Translation") {
                      topPartTranslationZ = elem.value.z;
                    }
                  }
                }
              }
              const isReversed = topPartTranslationZ < 0;

              var object = new THREE.Mesh(
                isReversed ? topGeometry : bottomGeometry,
                material
              );

              var topObject = new THREE.Mesh(
                isReversed ? bottomGeometry : topGeometry,
                material
              );

              for (let i = 0; i < obj.entity.properties.length; i++) {
                const element = obj.entity.properties[i];
                if (element.name === "mTopTransform") {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === "Rotation") {
                      this.applyRotation(topObject, [
                        elem.value.a,
                        elem.value.b,
                        elem.value.c,
                        elem.value.d
                      ]);
                    } else if (elem.name === "Translation") {
                      this.applyTranslation(topObject, [
                        elem.value.x,
                        elem.value.y,
                        elem.value.z
                      ]);
                    }
                  }
                }
              }

              object.add(topObject);

              // Fake the middle part of the conveyor lift
              const middleGeometry = new THREE.BoxBufferGeometry(
                38,
                180,
                topPartTranslationZ > 0
                  ? topPartTranslationZ
                  : -topPartTranslationZ
              );
              var middleObject = new THREE.Mesh(
                middleGeometry,
                this.materialFactory.createMaterial(obj)
              );
              middleObject.position.x = -60;
              middleObject.position.z = topPartTranslationZ / 2;
              object.add(middleObject);

              // the usual steps to add the object to the scene
              this.updateObjectVisuals(object, obj);

              object.userData = { id: index };
              this.$refs.scene.scene.add(object);
              this.objects.push(object);
            });
        });
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
      if (!isConveyorBelt(obj) && !isPowerLine(obj)) {
        this.applyRotation(object, obj.transform.rotation);
        object.rotateZ(1.5708); // 90 deg in radians
      } else {
        // TODO conveyor belt coordinates are given without rotation?
        this.applyRotation(object, [0, 0, 0, 1]);
      }

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

      if (
        !isConveyorBelt(this.selectedObject) &&
        !isPowerLine(this.selectedObject)
      ) {
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
