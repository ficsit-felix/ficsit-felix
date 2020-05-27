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
    @keydown.16="updateShiftSelect(true)"
    @keyup.16="updateShiftSelect(false)"
    @keydown.17="updateBoxSelect(true)"
    @keyup.17="updateBoxSelect(false)"
  >
    <!-- TODO keyup.f only focusses the object here and not in the object view -->
    <Toolbar
      :mode="mode"
      :local="local"
      @setLocal="setLocal(true)"
      @setWorld="setLocal(false)"
      @setTranslate="setMode('translate')"
      @setRotate="setMode('rotate')"
      @setScale="setMode('scale')"
      @reportBug="reportBug()"
      @focusSelectedObject="focusSelectedObject()"
    />

    <Renderer ref="renderer" :width="width" :height="height">
      <Scene ref="scene">
        <Camera @cameraChange="updateCompass" />
      </Scene>
    </Renderer>

    <div class="details">
      {{ filename }}
      <br />
      {{ uuid }}
      <br />
      {{ commithash }}
    </div>

    <Compass></Compass>
    <!--
      //currently disabled https://github.com/ficsit-felix/ficsit-felix/issues/86#issuecomment-512925021
    <Compass :rotateX="rotateX" :rotateZ="rotateZ"></Compass>
    -->

    <BugReportDialog
      ref="bugReport"
      :filename="filename"
      :uuid="uuid"
      :defaultIncludeSave="false"
    ></BugReportDialog>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from '@/js/OrbitControls';
import { TransformControls } from '@/js/TransformControls';
import _default, { mapActions, mapGetters, mapState } from 'vuex';
import Scene from './scene/Scene';
import Renderer from './scene/Renderer';
import Camera from './scene/Camera';
import { BoxBufferGeometry, LineCurve3, Mesh, error } from 'three';
import { setTimeout } from 'timers';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { modelHelper } from '@/helpers/modelHelper';
import { modelConfig } from '@/definitions/models';
import * as Sentry from '@sentry/browser';
import Toolbar from './Toolbar';
import { commithash } from '@/js/commithash';
import { getProperty, findActorByName } from '@/helpers/entityHelper';
import Compass from './Compass';
import { ConveyorCurvePath } from '@/js/ConveyorCurvePath';
import GeometryFactory from '@/graphics/GeometryFactory';
import ColorFactory from '@/graphics/ColorFactory';
import MeshFactory from '@/graphics/MeshFactory';
import MeshManager from '@/graphics/MeshManager';
import { updateActorMeshTransform } from '@/helpers/meshHelper';
import BugReportDialog from './BugReportDialog';

import {
  isConveyorBelt,
  isConveyorLift,
  isPowerLine,
  isRailroadTrack
} from '@/helpers/entityHelper';
import { EventBus } from '@/event-bus';
import { reportError } from '@/ts/errorReporting';
import { DIALOG_PROGRESS, DIALOG_OPEN_TIME_MS } from '../../ts/constants';

export default {
  name: 'Playground',
  components: {
    Renderer,
    Scene,
    Camera,
    Toolbar,
    Compass,
    BugReportDialog
  },
  provide() {
    return {
      playground: this
    };
  },
  data: function() {
    return {
      width: 100,
      height: 100,
      mode: 'translate',
      local: false,
      commithash,
      rotateX: 0,
      rotateZ: 0,
      bugReportVisible: false
    };
  },
  computed: {
    ...mapState([
      'dataLoaded',
      'uuid',
      'filename',
      'classes',
      'selectedPathNames',
      'selectedActors'
    ]),
    ...mapState('settings', [
      'showCustomPaints',
      'showModels',
      'showMap',
      'conveyorBeltResolution',
      'classColors',
      'experimentalFeatures'
    ]),
    ...mapGetters(['getVisibleObjects'])
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
        mesh.applyTransform(val[0]);
        //        updateActorMeshTransform(mesh, val[0]);
      }

      if (val != this.lastSelectedActors) {
        // selection needs to change

        for (const actor of this.lastSelectedActors) {
          if (!val.includes(actor)) {
            // deselect this actor
            const mesh = this.meshManager.findMeshByName(actor.pathName);
            if (mesh !== null) {
              mesh.setSelected(false, this.colorFactory, this.scene);
            }
          }
        }

        if (val.length > 0) {
          var visibleSelectedMeshes = [];
          for (const actor of val) {
            // select this actor
            const mesh = this.meshManager.findMeshAndVisibilityByName(
              actor.pathName
            );
            if (!this.lastSelectedActors.includes(actor)) {
              mesh.mesh.setSelected(true, this.colorFactory, this.scene);
            }
            if (mesh.visible) {
              visibleSelectedMeshes.push(mesh.mesh.getRaycastMesh());
            }
          }

          if (visibleSelectedMeshes.length === 1) {
            // TODO multiselection
            this.transformControl.attach(visibleSelectedMeshes[0]);
          } else {
            this.transformControl.detach();
          }
        } else {
          this.transformControl.detach();
        }
        this.lastSelectedActors = val;
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
            this.transformControl.attach(mesh.getRaycastMesh());
          }
        }
      }
    },

    showCustomPaints(value) {
      this.colorFactory.showCustomPaints = value;
      // update materials
      this.updateAllMaterials();
    },

    showModels(value) {
      this.geometryFactory.showModels = value;

      // completely rebuild all meshes
      this.meshManager.dispose(this.scene);
      this.meshManager = new MeshManager(this.scene, this.selectedMaterial);
      this.createMeshesForActors();
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
        this.colorFactory.classColors = this.classColors;
        this.colorFactory.setupDefaultMaterials();
        this.updateAllMaterials();
      }
    },

    experimentalFeatures(value) {
      if (value === false) {
        this.setBoxSelect(false);
        this.setShiftSelect(false);
      }
    }
  },

  mounted() {
    this.setProgressText({
      currentStep: this.$t('openPage.buildingWorld'),
      showCloseButton: false
    });
    this.setProgress(50);

    this.geometryFactory = new GeometryFactory(
      this.showModels,
      this.conveyorBeltResolution
    );

    var textureLoader = new THREE.TextureLoader();
    this.matcap = textureLoader.load('textures/matcap-white.png', function(
      matcap
    ) {
      matcap.encoding = THREE.sRGBEncoding;
    });

    this.colorFactory = new ColorFactory(
      this.matcap,
      this.showCustomPaints,
      this.classColors
    );
    this.meshFactory = new MeshFactory(this.geometryFactory, this.colorFactory);

    this.scene = this.$refs.scene.scene;

    this.selectedMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.meshManager = new MeshManager(this.scene, this.selectedMaterial);

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
    this.transformControl.space = 'world';
    // correct way to to this, but i don't want that many updates
    /*this.transformControl.addEventListener('objectChange', () => {
      this.objectChanged();
    })*/
    this.transformControl.addEventListener(
      'dragging-changed',
      event => {
        // this change needs to be synchronally, so that SelectControls / BoxSelectControls will be disabled before their mousedown fires
        this.$store.commit('SET_SELECTION_DISABLED', event.value);
        this.setSelectionDisabled(event.value);
        if (event.value == false) {
          this.onSelectedActorTransformChanged();
        }
      },
      false
    );
    this.scene.add(this.transformControl);

    // load map
    if (this.showMap) {
      this.loadMap();
    }

    /// EVENT HANDLERS ///

    // listen to window resize
    window.addEventListener('resize', this.handleResize);
    window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere

    EventBus.$on('delete', payload => {
      // remove all actors from scene
      this.meshManager.deleteSelectedMeshes(payload);
      this.transformControl.detach();
    });
  },
  methods: {
    ...mapActions([
      'loadData',
      'setSelectedObject',
      'setSelectionDisabled',
      'setBoxSelect',
      'setShiftSelect',
      'setProgress',
      'setProgressText'
    ]),

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
        modelHelper.loadGroup('/models/map.glb').then(model => {
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
      this.createMeshForActor(0);
    },

    createMeshForActor(index) {
      // we want to create them synchroniously so that we can track progress
      // and build all the instancedMeshGroups at the end

      this.setProgress((index / window.data.actors.length) * 50 + 50);

      if (index >= window.data.actors.length) {
        // created all meshes
        this.meshManager.buildInstancedMeshGroups();

        // hide progress bar dialog
        EventBus.$emit(DIALOG_PROGRESS, false);
        return;
      }

      let actor = window.data.actors[index];
      this.meshFactory
        .createMesh(actor, index)
        .then(result => {
          updateActorMeshTransform(result.mesh, actor);

          var visible = true;
          for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].name === actor.className) {
              visible = this.classes[i].visible;
              break;
            }
          }
          this.meshManager.add(result, visible);
          // create next mesh
          this.createMeshForActor(index + 1);
        })
        .catch(error => {
          reportError(error);
          this.createMeshForActor(index + 1);
        });
    },

    updateAllMaterials() {
      this.meshManager.updateAllMaterials(this.colorFactory);
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
      var elem = document.getElementById('scene');
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

      const mesh = this.meshManager.findMeshByName(
        this.selectedActors[0].pathName
      );
      const actor = mesh.applyTransformToActor(this.selectedActors[0]);

      this.setSelectedObject(actor);
    },

    // transform control
    setLocal(local) {
      this.local = local;
      if (local) {
        this.transformControl.space = 'local';
      } else {
        this.transformControl.space = 'world';
      }
    },

    setMode(mode) {
      this.mode = mode;
      this.transformControl.mode = mode;
    },

    focusScene() {
      // focus the scene div so no text fields get key inputs
      // needs a tabindex on the div, see https://stackoverflow.com/a/3656524
      document.getElementById('scene').focus();
    },
    updateBoxSelect(value) {
      if (this.experimentalFeatures) {
        this.setBoxSelect(value);
      }
    },
    updateShiftSelect(value) {
      if (this.experimentalFeatures) {
        this.setShiftSelect(value);
      }
    },
    reportBug() {
      this.$refs.bugReport.openReportWindow('');
    }
  }, // END OF METHODS

  beforeDestroy() {
    this.transformControl.detach();
    this.transformControl.dispose();
    window.removeEventListener('resize', this.handleResize);
    this.meshManager.dispose(this.scene);
    this.scene.dispose();
  }
};
</script>

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

.details {
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

<style>
.selectBox {
  border: 1px dashed #00bcd4;
  background-color: #00bcd43d;
  position: fixed;
  border-radius: 4px;
}
</style>
