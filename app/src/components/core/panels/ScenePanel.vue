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

<script lang="ts">
import * as THREE from 'three';
//@ts-ignore
import { TransformControls } from '@lib/graphics/TransformControls.js';
import _default, { mapActions, mapGetters, mapState } from 'vuex';
//@ts-ignore
import Scene from '../scene/Scene.js';
//@ts-ignore
import Renderer from '../scene/Renderer.js';
//@ts-ignore
import Camera from '../scene/Camera.js';
import {
  BoxBufferGeometry,
  LineCurve3,
  Mesh,
  error,
  Texture,
  Group
} from 'three';
import { setTimeout } from 'timers';
import { modelHelper } from '@lib/graphics/modelHelper';
import { modelConfig } from '@lib/definitions/models';
import * as Sentry from '@sentry/browser';
import Toolbar from '../Toolbar.vue';
import { commithash } from '@lib/commithash';
import { getProperty, findActorByName } from '@lib/graphics/entityHelper';
import Compass from '@/components/core/Compass.vue';
import { ConveyorCurvePath } from '@lib/graphics/ConveyorCurvePath';
import GeometryFactory from '@lib/graphics/GeometryFactory';
import ColorFactory from '@lib/graphics/ColorFactory';
import MeshFactory from '@lib/graphics/MeshFactory';
import { updateActorMeshTransform } from '@lib/graphics/meshHelper';
import BugReportDialog from '@/components/core/dialogs/BugReportDialog.vue';

import {
  isConveyorBelt,
  isConveyorLift,
  isPowerLine,
  isRailroadTrack
} from '@lib/graphics/entityHelper';
import { EventBus } from '@lib/event-bus';
import { reportError } from '@lib/errorReporting';
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  FOCUS_SELECTED_OBJECT,
  GUI_REFRESH_TIMEOUT,
  DELETE_OBJECTS,
  CREATE_OBJECTS
} from '@lib/constants';
import { MapType } from '@/store/settings';
import { TransformAction } from '@/store/undo';
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import MeshManager from '@lib/graphics/MeshManager';
import { Action, namespace, State } from 'vuex-class';
import { Actor, Component as Component2 } from 'satisfactory-json';

const undoNamespace = namespace('undo');
@Component({
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
  }
})
export default class ScenePanel extends Vue {
  @Ref('scene') readonly sceneRef!: ScenePanel;
  @Ref('renderer') readonly rendererRef!: any;
  @Ref('bugReport') readonly bugReportRef!: BugReportDialog;

  // state
  @State(state => state.uuid)
  uuid!: string;
  @State(state => state.filename)
  filename!: string;
  @State(state => state.classes)
  classes!: any[];
  @State(state => state.selectedPathNames)
  selectedPathNames!: string[];
  @State(state => state.selectedActors)
  selectedActors!: Actor[];

  @State(state => state.settings.showCustomPaints)
  showCustomPaints!: boolean;
  @State(state => state.settings.showModels)
  showModels!: boolean;
  @State(state => state.settings.mapType)
  mapType!: MapType;
  @State(state => state.settings.conveyorBeltResolution)
  conveyorBeltResolution!: number;
  @State(state => state.settings.classColors)
  classColors!: { [id: string]: string };
  @State(state => state.settings.experimentalFeatures)
  experimentalFeatures!: boolean;

  // actions
  @Action('loadData')
  loadData: any;
  @Action('setSelectedObject')
  setSelectedObject: any;
  @Action('setSelectionDisabled')
  setSelectionDisabled: any;
  @Action('setBoxSelect')
  setBoxSelect: any;
  @Action('setShiftSelect')
  setShiftSelect: any;
  @Action('setProgress')
  setProgress: any;
  @Action('setProgressText')
  setProgressText: any;
  @undoNamespace.Action('recordAction')
  recordAction: any;

  // vars
  matcap!: Texture;
  geometryFactory!: GeometryFactory;
  colorFactory!: ColorFactory;
  meshFactory!: MeshFactory;
  meshManager!: MeshManager;
  scene: any;
  selectedMaterial!: THREE.MeshMatcapMaterial;
  lastSelectedActors: Actor[] = [];
  transformControl: any;
  mapIngameModel?: Group;
  mapRenderModel?: Group;
  activeMapType = MapType.None;
  width = 100;
  height = 100;
  mode = 'translate';
  local = false;
  commithash = commithash;
  rotateX = 0;
  rotateZ = 0;
  bugReportVisible = false;

  // watchers
  @Watch('selectedActors')
  onSelectedActors(val: any) {
    if (val.length === 1) {
      const mesh = this.meshManager.findMeshByName(val[0].pathName);
      mesh?.applyTransform(val[0]);
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
            mesh?.mesh.setSelected(true, this.colorFactory, this.scene);
          }
          if (mesh?.visible) {
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
  }

  @Watch('classes', { deep: true })
  onClasses(val: any) {
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

  @Watch('showCustomPaints')
  onShowCustomPaints(value: boolean) {
    this.colorFactory.showCustomPaints = value;
    // update materials
    this.updateAllMaterials();
  }

  @Watch('showModels')
  onShowModels(value: boolean) {
    this.geometryFactory.showModels = value;

    // completely rebuild all meshes
    this.meshManager.dispose(this.scene);
    this.meshManager = new MeshManager(this.scene, this.selectedMaterial);
    this.createMeshesForActors();
  }
  @Watch('conveyorBeltResolution')
  onConveyorBeltResolution(value: number) {
    this.geometryFactory.conveyorBeltResolution = value;
    if (!this.showModels) {
      // Conveyor belts are not displayed
      return;
    }
    this.meshManager.rebuildConveyorBelts(this.geometryFactory);
  }

  @Watch('mapType')
  onMapType(value: MapType) {
    this.loadMap();
  }
  @Watch('classColors', { deep: true })
  onClassColors(value: any) {
    this.colorFactory.classColors = this.classColors;
    this.colorFactory.setupDefaultMaterials();
    this.updateAllMaterials();
  }

  @Watch('experimentalFeatures')
  onExperimentalFeatures(value: boolean) {
    if (value === false) {
      this.setBoxSelect(false);
      this.setShiftSelect(false);
    }
  }

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
      this.scene = this.sceneRef.scene;

      this.selectedMaterial = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: this.matcap
      });

      this.meshManager = new MeshManager(this.scene, this.selectedMaterial);

      this.lastSelectedActors = [];
      this.createMeshesForActors();

      this.transformControl = new TransformControls(
        this.rendererRef.camera.obj,
        this.rendererRef.renderer.domElement
      );
      this.transformControl.space = 'world';
      // correct way to to this, but i don't want that many updates
      //this.transformControl.addEventListener('objectChange', () => {
      //this.objectChanged();
      //})
      this.transformControl.addEventListener(
        'dragging-changed',
        (event: any) => {
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

      EventBus.$on(DELETE_OBJECTS, this.onDeleteObjects);
      EventBus.$on(CREATE_OBJECTS, this.onCreateObjects);
      EventBus.$on(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
    }, GUI_REFRESH_TIMEOUT);
  }

  beforeDestroy() {
    EventBus.$off(DELETE_OBJECTS, this.onDeleteObjects);
    EventBus.$off(CREATE_OBJECTS, this.onCreateObjects);
    EventBus.$off(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);

    this.transformControl.detach();
    this.transformControl.dispose();
    window.removeEventListener('resize', this.handleResize);
    this.meshManager.dispose(this.scene);
    this.scene.dispose();
  }

  updateCompass() {
    // TODO move to a onCameraChanged to only update when necessary
    const camera = this.rendererRef.camera.obj;
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
  }

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
  }

  createMeshesForActors() {
    this.createMeshForActor(0);
  }

  createMeshForActor(index: number) {
    // we want to create them synchroniously so that we can track progress
    // and build all the instancedMeshGroups at the end

    if (
      Math.floor(((index - 1) / window.data.actors.length) * 50 + 50) <
      Math.floor((index / window.data.actors.length) * 50 + 50)
    ) {
      // only change the progress bar, when the displayed number is changed
      this.setProgress((index / window.data.actors.length) * 50 + 50);
      setTimeout(() => {
        this.buildMesh(index);
      }, GUI_REFRESH_TIMEOUT);
    } else {
      this.buildMesh(index);
    }
  }

  buildMesh(index: number) {
    if (index >= window.data.actors.length) {
      // created all meshes
      this.meshManager.buildInstancedMeshGroups();

      // hide progress bar dialog
      EventBus.$emit(DIALOG_PROGRESS, false);
      return;
    }

    let actor = window.data.actors[index];
    this.meshFactory
      .createMesh(actor)
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
  }

  updateAllMaterials() {
    this.meshManager.updateAllMaterials(this.colorFactory);
  }

  sendFocusEvent() {
    EventBus.$emit(FOCUS_SELECTED_OBJECT);
  }
  focusSelectedObject() {
    if (this.selectedActors.length === 1) {
      let camera = this.rendererRef.camera.controls;
      const actor = this.selectedActors[0];
      // changed because of coordinate system change
      camera.target.x = actor.transform.translation[1];
      camera.target.y = actor.transform.translation[0];
      camera.target.z = actor.transform.translation[2];
    }
  }
  storeCameraState() {
    this.rendererRef.camera.updateCameraState();
  }

  handleResize() {
    let elem = document.getElementById('scene');
    if (elem === undefined || elem === null) {
      return;
    }
    let width = elem.offsetWidth;
    let height = elem.offsetHeight;
    this.width = width;
    this.height = height;
  }
  onSelectedActorTransformChanged() {
    if (this.selectedActors.length !== 1) {
      return; // TODO multiple actors
    }

    // TODO detect when the mesh has not moved at all (just a click and not a drag) and don't do anything

    const mesh = this.meshManager.findMeshByName(
      this.selectedActors[0].pathName
    );
    // Make this undoable TODO localize, different move, rot, scale
    this.recordAction(
      new TransformAction(
        'transform',
        JSON.stringify(this.selectedActors[0].transform)
      )
    );

    const actor = mesh?.applyTransformToActor(this.selectedActors[0]);

    this.setSelectedObject(actor);
  }

  // transform control
  setLocal(local: boolean) {
    this.local = local;
    if (local) {
      this.transformControl.space = 'local';
    } else {
      this.transformControl.space = 'world';
    }
  }

  setMode(mode: string) {
    this.mode = mode;
    this.transformControl.mode = mode;
  }

  focusScene() {
    // focus the scene div so no text fields get key inputs
    // needs a tabindex on the div, see https://stackoverflow.com/a/3656524
    //@ts-ignore
    document.getElementById('scene').focus();
    // FIXME
  }
  updateBoxSelect(value: boolean) {
    if (this.experimentalFeatures) {
      this.setBoxSelect(value);
    }
  }
  updateShiftSelect(value: boolean) {
    if (this.experimentalFeatures) {
      this.setShiftSelect(value);
    }
  }
  reportBug() {
    this.bugReportRef.openReportWindow('');
  }

  onDeleteObjects(payload: { actors: Actor[]; components: Component2[] }) {
    // remove all actors from scene
    this.meshManager.deleteMeshesForActors(payload.actors);
    this.transformControl.detach();
  }

  onCreateObjects(payload: { actors: Actor[]; components: Component2[] }) {
    Promise.all(
      payload.actors.map(actor =>
        this.meshFactory
          .createMesh(actor)
          .then(result => {
            return new Promise<string>((resolve, reject) => {
              updateActorMeshTransform(result.mesh, actor);

              let visible = true;
              for (let i = 0; i < this.classes.length; i++) {
                if (this.classes[i].name === actor.className) {
                  visible = this.classes[i].visible;
                  break;
                }
              }

              // TODO If this mesh already exists in the InstancedMeshGroup, but was just made invisible (during the previous delete that we are undoing now), don't add a new mesh, but just make that one visible
              this.meshManager.add(result, visible);
              resolve(result.instance);
            });
          })
          .catch(error => {
            reportError(error);
            return new Promise<string>((resolve, reject) => resolve(undefined));
          })
      )
    ).then(instances => {
      // Rebuild all InstancedMeshGroups where we added an instance
      const instancesUnique = new Set<string>(instances);
      for (const instance of instancesUnique) {
        if (instance !== undefined) {
          this.meshManager.instancedMeshGroups[instance].rebuild();
        }
      }
      // This is called when all models are added
      // select the models now
      this.$store.commit('SET_SELECTED', [
        ...payload.actors.map(actor => actor.pathName),
        ...payload.components.map(component => component.pathName)
      ]);
    });

    for (const actor of payload.actors) {
      this.meshFactory.createMesh(actor);
    }
  }

  /*
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
,
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
*/
}
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
