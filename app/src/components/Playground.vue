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
    @keyup.delete="$emit('askDeleteSelectedObject')"
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
import MeshManager from "@/graphics/MeshManager";
import { updateActorMeshTransform } from "@/helpers/meshHelper";

import {
  isConveyorBelt,
  isConveyorLift,
  isPowerLine
} from "../helpers/entityHelper";
import { EventBus } from "../event-bus";

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
      "dataLoaded",
      "uuid",
      "filename",
      "classes",
      "selectedPathNames",
      "selectedActors"
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
    selectedActors(val) {
      if (val.length === 1) {
        const mesh = this.meshManager.findMeshByName(val[0].pathName);
        updateActorMeshTransform(mesh, val[0]);
      }

      if (val != this.lastSelectedActors) {
        // selection needs to change

        for (const actor of this.lastSelectedActors) {
          if (!val.includes(actor)) {
            // deselect this actor
            const mesh = this.meshManager.findMeshByName(actor.pathName);
            if (mesh !== null) {
              mesh.material = this.materialFactory.createMaterial(actor);
            }
          }
        }

        this.lastSelectedActors = val;

        if (val.length > 0) {
          var visibleSelectedMeshes = [];
          for (const actor of val) {
            // select this actor
            const mesh = this.meshManager.findMeshAndVisibilityByName(
              actor.pathName
            );
            mesh.mesh.material = this.selectedMaterial;
            if (mesh.visible) {
              visibleSelectedMeshes.push(mesh.mesh);
            }
          }

          if (visibleSelectedMeshes.length === 1) {
            // TODO multiselection
            this.transformControl.attach(visibleSelectedMeshes[0]);
          }
        } else {
          this.transformControl.detach();
        }
      }
    },

    classes: {
      deep: true,
      handler(val) {
        this.meshManager.updateClassVisibility(val);

        // fix transform helper
        if (this.selectedActors.length === 1) {
          // TODO multiselection
          const mesh = this.meshManager.findVisibleMeshByName(
            this.selectedActors[0].pathName
          );
          if (mesh === null) {
            this.transformControl.detach();
          } else {
            this.transformControl.attach(mesh);
          }
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
      this.meshManager.rebuildAllGeometry(this.geometryFactory);
    },
    conveyorBeltResolution(value) {
      this.geometryFactory.conveyorBeltResolution = value;
      if (!this.showModels) {
        // Conveyor belts are not displayed
        return;
      }
      this.meshManager.rebuildConveyorBelts(this.geometryFactory);
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

    this.scene = this.$refs.scene.scene;

    this.meshManager = new MeshManager(this.scene);

    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.loader = new GLTFLoader();

    this.geometries = {};

    this.lastSelectedActors = [];
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
        this.onSelectedActorTransformChanged();
      }
    });
    this.scene.add(this.transformControl);

    // load map
    if (this.showMap) {
      this.loadMap();
    }

    /// EVENT HANDLERS ///

    // listen to window resize
    window.addEventListener("resize", this.handleResize);
    window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere

    EventBus.$on("delete", payload => {
      // remove all actors from scene
      this.meshManager.deleteSelectedMeshes(payload);
    });
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
            this.meshManager.add(mesh);
          });
        }
      }
    },

    updateAllMaterials() {
      this.meshManager.updateAllMaterials(this.materialFactory);
    },

    focusSelectedObject() {
      if (this.selectedActors.length === 1) {
        var camera = this.$refs.renderer.camera.controls;
        const actor = this.selectedActors[0];
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
      var elem = document.getElementById("scene");
      if (elem === undefined || elem === null) {
        return;
      }
      var width = elem.offsetWidth;
      var height = elem.offsetHeight;
      this.width = width;
      this.height = height;
    },
    onSelectedActorTransformChanged() {
      if (this.selectedActors.length !== 1) {
        return; // TODO multiple actors
      }

      const actor = this.selectedActors[0];
      const mesh = this.meshManager.findMeshByName(actor.pathName);

      // TODO need to clone, else change is not detected?
      // find more intelligent way
      var clone = Object.assign({}, actor);
      // switched to accord for coordinate system change!
      clone.transform.translation[1] = mesh.position.x;
      clone.transform.translation[0] = mesh.position.y;
      clone.transform.translation[2] = mesh.position.z;

      if (!isConveyorBelt(actor) && !isPowerLine(actor)) {
        mesh.rotateZ(-1.5708); // -90 deg in radians
      } // TODO conveyor belt coordinates are given without rotation?
      clone.transform.rotation[0] = mesh.quaternion.x;
      clone.transform.rotation[1] = mesh.quaternion.y;
      clone.transform.rotation[2] = -mesh.quaternion.z;
      clone.transform.rotation[3] = mesh.quaternion.w;

      clone.transform.scale3d[0] = mesh.scale.x;
      clone.transform.scale3d[1] = mesh.scale.y;
      clone.transform.scale3d[2] = mesh.scale.z;

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
    this.meshManager.dispose();
  }
};
</script>
