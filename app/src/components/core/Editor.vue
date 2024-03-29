<template>
  <div class="editor">
    <div class="maincolumn">
      <Menubar v-if="showMenubar" />
      <div class="mainrow">
        <golden-layout
          class="main-layout"
          :showPopoutIcon="false"
          :showMaximiseIcon="true"
          :showCloseIcon="false"
          :headerHeight="22"
          :dragProxyHeight="0"
          @state="changeLayout"
          :state="layout"
          @creation-error="onLayoutError"
          :key="layoutComponentKey"
          @initialised="onLayoutInitialised"
        >
          <!-- dragProxyHeight = 0  ==>  We would want to disable the drop proxy entirely, but that is not yet possible: https://github.com/golden-layout/golden-layout/issues/466 -->

          <gl-row :closeable="false">
            <gl-component
              :title="$t('panels.scene.title')"
              :closable="false"
              :reorderEnabled="false"
              :width="60"
              @resize="onSceneResize"
            >
              <ScenePanel
                ref="playground"
                @ask-delete-selected-object="
                  $refs.propertyEditor.deleteKeyPressed()
                "
              />
            </gl-component>

            <gl-col :width="17">
              <gl-component
                :title="$t('panels.objectList.title')"
                :closable="false"
                :height="70"
              >
                <ObjectListPanel ref="objectList" />
              </gl-component>
              <gl-component
                :title="$t('panels.classList.title')"
                :closable="false"
                :height="30"
              >
                <ClassListPanel />
              </gl-component>
            </gl-col>
            <gl-stack :width="23">
              <gl-component :title="$t('panels.json.title')" :closable="false">
                <JsonPanel ref="propertyEditor" />
              </gl-component>
              <gl-component
                :title="$t('panels.properties.title')"
                v-if="layoutSettings.propertiesPanelEnabled"
                :closable="false"
              >
                <PropertiesPanel />
              </gl-component>
            </gl-stack>
          </gl-row>
        </golden-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reportException } from '@/lib/core/errorReporting';
import {
  Component as VueComponent,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { mapState } from 'vuex';
import { namespace, State } from 'vuex-class';
import Menubar from '../web/Menubar.vue';
import ClassListPanel from './panels/ClassListPanel.vue';
import JsonPanel from './panels/JsonPanel.vue';
import ObjectListPanel from './panels/ObjectListPanel.vue';
import PropertiesPanel from './panels/PropertiesPanel.vue';
import ScenePanel from './panels/ScenePanel.vue';

const settingsNamespace = namespace('settings');

@VueComponent({
  components: {
    Menubar,
    ScenePanel,
    ObjectListPanel,
    JsonPanel,
    ClassListPanel,
    PropertiesPanel,
  },
  computed: {
    ...mapState('settings', ['showPropertiesPanel']),
  },
})
export default class Editor extends Vue {
  @Prop({ default: true }) showMenubar!: boolean;
  @State((state) => state.settings.layout) layout: any;
  @State((state) => state.settings.layoutSettings) layoutSettings: any;
  @State((state) => state.settings.showPropertiesPanel)
  showPropertiesPanel!: boolean;

  @settingsNamespace.Action('resetLayout')
  resetLayout: any;
  @settingsNamespace.Action('setPropertiesPanelEnabled')
  setPropertiesPanelEnabled: any;

  // used to remount the golden-layout component after layout reset, see https://stackoverflow.com/a/47466574
  layoutComponentKey: number = 0;

  // Watch layout settings changes and change the corresponding layout only when the editor is active
  @Watch('showPropertiesPanel')
  onPropertiesPanel(value: boolean) {
    if (value != this.layoutSettings.propertiesPanelEnabled) {
      this.setPropertiesPanelEnabled(value);
    }
  }

  onLayoutInitialised() {
    // apply possibly changed settings to layout after it is initalized
    this.onPropertiesPanel(this.showPropertiesPanel);
  }

  changeLayout(layout: any) {
    this.$store.commit('settings/SET_LAYOUT', layout);
  }

  onSceneResize() {
    (this.$refs.playground as any).handleResize();
  }

  onLayoutError() {
    // The layout was not compatible with the current settings
    // Report the current settings state
    console.log(JSON.stringify(this.$store.state.settings));
    reportException('Could not load stored layout');
    this.resetLayout();
    // remount the golden-layout component as the layout state is only read on mount
    this.layoutComponentKey = 1 - this.layoutComponentKey;
  }
}
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
}

.maincolumn {
  display: flex;
  flex-flow: column;
  overflow: auto;
  height: 100%;
}
.menubar {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
}
.mainrow {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  min-height: 0px; // needed for Firefox, else this can become HUUGE
}

.main-layout {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
// TODO rewrite to scoped using ::v-deep https://stackoverflow.com/a/55368933

@import '@/assets/colors.scss';
/* non scoped styles to control split bars */
.split {
  overflow: hidden !important;
}
.gutter {
  background-color: $surface !important;
  opacity: 0.4; // lessen the brightness of the gutter background image
}
</style>
