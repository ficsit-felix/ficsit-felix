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
    @keyup.delete="$emit('ask-delete-selected-object')"
    @keydown.16="updateShiftSelect(true)"
    @keyup.16="updateShiftSelect(false)"
    @keydown.17="updateBoxSelect(true)"
    @keyup.17="updateBoxSelect(false)"
  >
    <!-- TODO keyup.f only focusses the object here and not in the object view -->
    <Toolbar
      :mode="mode"
      :local="local"
      @set-local="setLocal(true)"
      @set-world="setLocal(false)"
      @set-translate="setMode('translate')"
      @set-rotate="setMode('rotate')"
      @set-scale="setMode('scale')"
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
  </div>
</template>

<script lang="ts">
import Compass from '@/components/core/Compass.vue';
import { TransformAction } from '@/store/undo';
import { commithash } from '@lib/commithash';
import {
  CAMERA_CHANGE,
  CREATE_OBJECTS,
  DELETE_OBJECTS,
  DIALOG_PROGRESS,
  FOCUS_SELECTED_OBJECT,
  GUI_REFRESH_TIMEOUT,
  SCENE_RESIZE,
} from '@lib/constants';
import { reportError } from '@lib/errorReporting';
import { EventBus } from '@lib/event-bus';
import ColorFactory from '@lib/graphics/ColorFactory';
import GeometryFactory from '@lib/graphics/GeometryFactory';
import MeshFactory from '@lib/graphics/MeshFactory';
import { updateActorMeshTransform } from '@lib/graphics/meshHelper';
import MeshManager from '@lib/graphics/MeshManager';
import { modelHelper } from '@lib/graphics/modelHelper';
import { SelectionBoundsBox } from '@lib/graphics/SelectionBoundsBox';
import { Actor, Component } from 'satisfactory-json';
import * as THREE from 'three';
import {
  Camera as ThreeCamera,
  DirectionalLight,
  Group,
  MathUtils,
  MeshStandardMaterial,
  Texture,
  Vector3,
} from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { setTimeout } from 'timers';
import {
  Component as VueComponent,
  Ref,
  Vue,
  Watch,
} from 'vue-property-decorator';
import {} from 'vuex';
import { Action, namespace, State } from 'vuex-class';
//@ts-ignore
import Camera from '../scene/Camera.js';
//@ts-ignore
import Renderer from '../scene/Renderer.js';
//@ts-ignore
import Scene from '../scene/Scene.js';
import Toolbar from '../Toolbar.vue';

const undoNamespace = namespace('undo');
@VueComponent({
  components: {
    Renderer,
    Scene,
    Camera,
    Toolbar,
    Compass,
  },
  provide() {
    return {
      playground: this,
    };
  },
})
export default class ScenePanel extends Vue {
  @Ref('scene') readonly sceneRef!: ScenePanel;
  @Ref('renderer') readonly rendererRef!: any;

  // state
  @State((state) => state.uuid)
  uuid!: string;
  @State((state) => state.filename)
  filename!: string;
  @State((state) => state.classes)
  classes!: any[];
  @State((state) => state.selectedPathNames)
  selectedPathNames!: string[];
  @State((state) => state.selectedActors)
  selectedActors!: Actor[];

  @State((state) => state.settings.showCustomPaints)
  showCustomPaints!: boolean;
  @State((state) => state.settings.showModels)
  showModels!: boolean;
  @State((state) => state.settings.conveyorBeltResolution)
  conveyorBeltResolution!: number;
  @State((state) => state.settings.classColors)
  classColors!: { [id: string]: string };
  @State((state) => state.settings.experimentalFeatures)
  experimentalFeatures!: boolean;
  @State((state) => state.settings.snapping)
  snapping!: boolean;
  @State((state) => state.settings.translationSnap)
  translationSnap!: number;
  @State((state) => state.settings.rotationSnap)
  rotationSnap!: number;

  // actions
  @Action('loadData')
  loadData: any;
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
  @Action('translateMultipleActors')
  translateMultipleActors: any;

  // vars
  geometryFactory!: GeometryFactory;
  colorFactory!: ColorFactory;
  meshFactory!: MeshFactory;
  meshManager!: MeshManager;
  scene: any;
  selectedMaterial!: MeshStandardMaterial;
  lastSelectedActors: Actor[] = [];
  transformControl!: TransformControls;
  mapIngameModel?: Group;
  mapRenderModel?: Group;
  width = 100;
  height = 100;
  mode = 'translate';
  local = false;
  commithash = commithash;
  rotateX = 0;
  rotateZ = 0;
  selectionBoundsBox!: SelectionBoundsBox;

  // watchers
  @Watch('selectedActors', { deep: true })
  onSelectedActors(val: any) {
    // Update on transform changes that occured outside
    if (val.length === 1) {
      const mesh = this.meshManager.findMeshByName(val[0].pathName);
      mesh?.applyTransform(val[0]);
      //        updateActorMeshTransform(mesh, val[0]);
    } else {
      val.forEach((actor: any) => {
        const mesh = this.meshManager.findMeshByName(actor.pathName);
        mesh?.applyTransform(actor);
      });
    }

    if (val != this.lastSelectedActors || val.length > 1) {
      // selection needs to change, this is always true for multiple selections, because the AABB needs to be updated

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
          this.selectionBoundsBox.setVisible(false);
        } else {
          this.selectionBoundsBox.setBounds(visibleSelectedMeshes);
          this.selectionBoundsBox.setVisible(true);
          this.transformControl.attach(this.selectionBoundsBox.helper);
          //this.transformControl.detach();
        }
      } else {
        this.selectionBoundsBox.setVisible(false);
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
    // TODO fix multiselection!
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

  @Watch('snapping')
  onSnappingChange(value: boolean) {
    if (value) {
      this.transformControl.translationSnap = this.translationSnap;
      this.transformControl.rotationSnap =
        this.rotationSnap * MathUtils.DEG2RAD;
    } else {
      this.transformControl.translationSnap = null;
      this.transformControl.rotationSnap = null;
    }
  }

  @Watch('translationSnap')
  onTranslationSnapChange(value: number) {
    if (this.snapping) {
      this.transformControl.translationSnap = value;
    }
  }

  @Watch('rotationSnap')
  onRotationSnapChange(value: number) {
    if (this.snapping) {
      this.transformControl.rotationSnap = value * MathUtils.DEG2RAD;
    }
  }

  mounted() {
    setTimeout(() => {
      // show the progress dialog in case it was not already shown (should only happen on reload during development)
      EventBus.$emit(DIALOG_PROGRESS, true);

      this.setProgressText({
        currentStep: this.$t('openPage.buildingWorld'),
        showCloseButton: false,
      });
      this.setProgress(50);
      this.geometryFactory = new GeometryFactory(
        this.showModels,
        this.conveyorBeltResolution
      );

      this.colorFactory = new ColorFactory(
        this.showCustomPaints,
        this.classColors
      );
      this.meshFactory = new MeshFactory(
        this.geometryFactory,
        this.colorFactory
      );
      this.scene = this.sceneRef.scene;

      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
      this.scene.add(light);

      this.selectedMaterial = new MeshStandardMaterial();

      this.meshManager = new MeshManager(this.scene, this.selectedMaterial);

      this.lastSelectedActors = [];
      this.createMeshesForActors();

      this.transformControl = new TransformControls(
        this.rendererRef.camera.obj,
        this.rendererRef.renderer.domElement
      );
      this.transformControl.space = 'world';
      this.transformControl.translationSnap = this.snapping
        ? this.translationSnap
        : null;
      this.transformControl.rotationSnap = this.snapping
        ? this.rotationSnap * MathUtils.DEG2RAD
        : null;
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
        }
      );
      this.scene.add(this.transformControl);

      // box helper
      this.selectionBoundsBox = new SelectionBoundsBox(this.scene);

      /// EVENT HANDLERS ///

      // listen to window resize
      window.addEventListener('resize', this.handleResize);
      window.setTimeout(this.handleResize, 50); // TODO replace with correct initial state somewhere

      EventBus.$on(DELETE_OBJECTS, this.onDeleteObjects);
      EventBus.$on(CREATE_OBJECTS, this.onCreateObjects);
      EventBus.$on(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
      EventBus.$on(CAMERA_CHANGE, this.onCameraChange);
      EventBus.$on(SCENE_RESIZE, this.handleResize);
    }, GUI_REFRESH_TIMEOUT);
  }

  beforeDestroy() {
    EventBus.$off(DELETE_OBJECTS, this.onDeleteObjects);
    EventBus.$off(CREATE_OBJECTS, this.onCreateObjects);
    EventBus.$off(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
    EventBus.$off(CAMERA_CHANGE, this.onCameraChange);
    EventBus.$off(SCENE_RESIZE, this.handleResize);

    this.transformControl.detach();
    this.transformControl.dispose();
    window.removeEventListener('resize', this.handleResize);
    this.meshManager.dispose(this.scene);
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
      .then((result) => {
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
      .catch((error) => {
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
    let camera = this.rendererRef.camera.controls;
    if (this.selectedActors.length === 1) {
      const actor = this.selectedActors[0];
      // changed order because of coordinate system change
      camera.focus(
        actor.transform.translation[1],
        actor.transform.translation[0],
        actor.transform.translation[2]
      );
    } else if (this.selectedActors.length > 1) {
      // TODO when multiple objects are selected, focus the center of the AABB
      camera.focus(
        this.selectionBoundsBox.helper.position.x,
        this.selectionBoundsBox.helper.position.y,
        this.selectionBoundsBox.helper.position.z
      );
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

    let camera = this.rendererRef.camera;
    camera.resize(width, height);
  }
  onSelectedActorTransformChanged() {
    // This is called when the transform control is released and the move/rotation/scale action is finished

    // TODO detect when the mesh has not moved at all (just a click and not a drag) and don't do anything

    if (this.selectedActors.length !== 1) {
      // until now only the SelectionBoxHelper has been transformed. Apply this transformation to the selected actors now
      console.log(this.selectionBoundsBox.helper.position);
      console.log(this.selectionBoundsBox.helper.rotation);
      console.log(this.selectionBoundsBox.helper.scale);

      if (
        !this.selectionBoundsBox.helper.position.equals(
          this.selectionBoundsBox.helper.prevPosition
        )
      ) {
        let distance = new Vector3();
        distance.subVectors(
          this.selectionBoundsBox.helper.position,
          this.selectionBoundsBox.helper.prevPosition
        );
        this.translateMultipleActors(
          new Vector3(distance.y, distance.x, distance.z)
        );

        console.log('detect translation', distance);
      }

      if (
        !this.selectionBoundsBox.helper.rotation.equals(
          this.selectionBoundsBox.helper.prevRotation
        )
      ) {
        console.log('detect rotation', this.selectionBoundsBox.helper.rotation);
      }
      console.log('multiple actors');

      return;
    }

    // Update only a single actor
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

    // apply the transformation from the mesh to the actor
    mesh?.applyTransformToActor(this.selectedActors[0]);
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

  onDeleteObjects(payload: { actors: Actor[]; components: Component[] }) {
    // remove all actors from scene
    this.meshManager.deleteMeshesForActors(payload.actors);
    this.transformControl.detach();
  }

  onCreateObjects(payload: { actors: Actor[]; components: Component[] }) {
    Promise.all(
      payload.actors.map((actor) =>
        this.meshFactory
          .createMesh(actor)
          .then((result) => {
            return new Promise<string | undefined>((resolve, reject) => {
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
          .catch((error) => {
            reportError(error);
            return new Promise<undefined>((resolve, reject) =>
              resolve(undefined)
            );
          })
      )
    ).then((instances) => {
      // Rebuild all InstancedMeshGroups where we added an instance
      const instancesUnique = new Set<string | undefined>(instances);
      for (const instance of instancesUnique) {
        if (instance !== undefined) {
          this.meshManager.instancedMeshGroups[instance].rebuild();
        }
      }
      // This is called when all models are added
      // select the models now
      this.$store.commit('SET_SELECTED', [
        ...payload.actors.map((actor) => actor.pathName),
        ...payload.components.map((component) => component.pathName),
      ]);
    });

    for (const actor of payload.actors) {
      this.meshFactory.createMesh(actor);
    }
  }

  onCameraChange(camera: ThreeCamera) {
    this.transformControl.camera = camera;
  }
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
