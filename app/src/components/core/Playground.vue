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
    @keyup.f="sendFocusEvent()"
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
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  FOCUS_SELECTED_OBJECT,
  GUI_REFRESH_TIMEOUT
} from '../../ts/constants';
import { MapType } from '@/store/settings';
import {TransformAction} from '@/store/undo';

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
      'uuid',
      'filename',
      'classes',
      'selectedPathNames',
      'selectedActors'
    ]),
    ...mapState('settings', [
      'showCustomPaints',
      'showModels',
      'mapType',
      'conveyorBeltResolution',
      'classColors',
      'experimentalFeatures'
    ])
  },
  watch: {
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
          let visibleSelectedMeshes = [];
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

    mapType(value) {
      this.loadMap();
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
    setTimeout(() => {
      // show the progress dialog in case it was not already shown (should only happen on reload during development)
      EventBus.$emit(DIALOG_PROGRESS, true);

      this.setProgressText({
        currentStep: this.$t('openPage.buildingWorld'),
        showCloseButton: false
      });
      this.setProgress(50);
      this.geometryFactory = new GeometryFactory(
        this.showModels,
        this.conveyorBeltResolution
      );

      let textureLoader = new THREE.TextureLoader();
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
      this.meshFactory = new MeshFactory(
        this.geometryFactory,
        this.colorFactory
      );

      this.scene = this.$refs.scene.scene;

      this.selectedMaterial = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: this.matcap
      });

      this.meshManager = new MeshManager(this.scene, this.selectedMaterial);

      this.loader = new GLTFLoader();

      this.geometries = {};

      this.lastSelectedActors = [];
      this.createMeshesForActors();

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
          if (event.value == false) {
            this.onSelectedActorTransformChanged();
          }
        },
        false
      );
      this.scene.add(this.transformControl);

      // load map
      this.loadMap();

      /// EVENT HANDLERS ///

      // listen to window resize
      window.addEventListener('resize', this.handleResize);
      window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere

      EventBus.$on('delete', payload => {
        // TODO move to constants?
        // remove all actors from scene
        this.meshManager.deleteSelectedMeshes(payload);
        this.transformControl.detach();
      });
      EventBus.$on(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
    }, GUI_REFRESH_TIMEOUT);
  },
  beforeDestroy() {
    EventBus.$off('delete');
    EventBus.$off(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
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

    ...mapActions('undo', ['recordAction']),
    updateCompass() {
      // TODO move to a onCameraChanged to only update when necessary
      const camera = this.$refs.renderer.camera.obj;
      let position = new THREE.Vector3();
      let quaternion = new THREE.Quaternion();
      let scale = new THREE.Vector3();

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
      if (this.mapType === this.activeMapType) {
        return;
      }

      // hide old map
      switch (this.activeMapType) {
        case MapType.Render:
          this.scene.remove(this.mapRenderModel);
          break;
        case MapType.Ingame:
          this.scene.remove(this.mapIngameModel);
          break;
      }

      this.activeMapType = this.mapType;

      // show new map
      switch (this.mapType) {
        case MapType.Render:
          if (this.mapRenderModel === undefined) {
            modelHelper.loadGroup('/models/map_render.glb').then(model => {
              this.mapRenderModel = model;
              this.scene.add(this.mapRenderModel);
            });
          } else {
            this.scene.add(this.mapRenderModel);
          }
          break;
        case MapType.Ingame:
          if (this.mapIngameModel === undefined) {
            modelHelper.loadGroup('/models/map_ingame.glb').then(model => {
              this.mapIngameModel = model;
              this.scene.add(this.mapIngameModel);
            });
          } else {
            this.scene.add(this.mapIngameModel);
          }
          break;
      }
    },

    createMeshesForActors() {
      this.createMeshForActor(0);
    },

    createMeshForActor(index) {
      // we want to create them synchroniously so that we can track progress
      // and build all the instancedMeshGroups at the end

      if (
        parseInt(((index - 1) / window.data.actors.length) * 50 + 50) <
        parseInt((index / window.data.actors.length) * 50 + 50)
      ) {
        // only change the progress bar, when the displayed number is changed
        this.setProgress((index / window.data.actors.length) * 50 + 50);
        setTimeout(() => {
          this.buildMesh(index);
        }, GUI_REFRESH_TIMEOUT);
      } else {
        this.buildMesh(index);
      }
    },

    buildMesh(index) {
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

          let visible = true;
          for (let i = 0; i < this.classes.length; i++) {
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

    sendFocusEvent() {
      EventBus.$emit(FOCUS_SELECTED_OBJECT);
    },
    focusSelectedObject() {
      if (this.selectedActors.length === 1) {
        let camera = this.$refs.renderer.camera.controls;
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
      let elem = document.getElementById('scene');
      if (elem === undefined || elem === null) {
        return;
      }
      let width = elem.offsetWidth;
      let height = elem.offsetHeight;
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
      // Make this undoable TODO localize, different move, rot, scale
      this.recordAction(
        new TransformAction(
          'transform',
          this.selectedActors[0].pathName,
          this.selectedActors[0].transform
        )
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
