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
import MeshFactory from "@/graphics/MeshFactory";
import { updateActorMeshTransform } from "@/helpers/meshHelper";

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
        this.createMeshesForActors();
      }
    },
    selectedIndex(val) {
      if (val != this.lastSelectedIndex) {
        if (this.lastSelectedIndex >= 0) {
          //  && this.lastSelectedIndex < this.objects.length
          this.setMaterial(
            this.lastSelectedIndex,
            this.materialFactory.createMaterial(
              window.data.actors[this.lastSelectedIndex]
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
                window.data.actors[obj.userData.id].className === item.name
              ) {
                this.scene.add(obj);
                this.invisibleObjects.splice(j, 1);
                this.objects.push(obj);
              }
            }
          } else {
            for (var k = this.objects.length - 1; k >= 0; k--) {
              const obj = this.objects[k];

              if (
                window.data.actors[obj.userData.id].className === item.name
              ) {
                this.scene.remove(obj);
                this.objects.splice(k, 1);
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
        const obj = window.data.actors[object.userData.id];

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
        const obj = window.data.actors[object.userData.id];

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
          this.scene.remove(this.mapModel);
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
    this.meshFactory = new MeshFactory(
      this.geometryFactory,
      this.materialFactory
    );

    this.objects = [];
    this.invisibleObjects = [];
    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.scene = this.$refs.scene.scene;

    this.loader = new GLTFLoader();

    this.geometries = {};

    this.lastSelectedIndex = -1;
    if (this.dataLoaded) {
      this.createMeshesForActors();
    }

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
    this.scene.add(this.transformControl);

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
      if (this.mapModel === undefined) {
        modelHelper.loadScene("/models/map.glb").then(model => {
          this.mapModel = model;
          if (this.showMap) {
            this.scene.add(model);
          }
        });
      } else {
        if (this.showMap) {
          this.scene.add(this.mapModel);
        } else {
          this.scene.remove(this.mapModel);
        }
      }
    },

    createMeshesForActors() {
      for (let i = 0; i < window.data.actors.length; i++) {
        let actor = window.data.actors[i];
        if (actor.type == 1) {
          this.meshFactory.createMesh(actor, i).then(mesh => {
            updateActorMeshTransform(mesh, actor);
            this.scene.add(mesh);
            this.objects.push(mesh);
          });
        }
      }
    },

    setMaterial(id, material) {
      for (const obj of this.objects) {
        if (obj.userData.id === id) {
          obj.material = material;
          for (let j = 0; j < obj.children.length; j++) {
            const element = obj.children[j];
            element.material = material;
          }
          return;
        }
      }

      for (const obj of this.invisibleObjects) {
        if (obj.userData.id === id) {
          obj.material = material;
          for (let j = 0; j < obj.children.length; j++) {
            const element = obj.children[j];
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
        const obj = window.data.actors[object.userData.id];
        const material = this.materialFactory.createMaterial(obj);
        object.material = material;
      }
    },
    getObjWithId(id) {
      for (const obj of this.objects) {
        if (obj.userData.id === id) {
          return obj;
        }
      }
      for (const obj of this.invisibleObjects) {
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

    focusSelectedObject() {
      var camera = this.$refs.renderer.camera.controls;
      var actor = window.data.actors[this.selectedIndex];
      if (actor.type === 1) {
        // changed because of coordinate system change
        camera.target.x = actor.transform.translation[1];
        camera.target.y = actor.transform.translation[0];
        camera.target.z = actor.transform.translation[2];
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
      this.scene.remove(this.objects[i]);
    }
  }
};
</script>
