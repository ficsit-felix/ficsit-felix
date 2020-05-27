<template>
  <div class="editor">
    <div class="maincolumn">
      <Menubar v-if="showMenubar" />
      <div class="mainrow">
        <golden-layout
          class="main-layout"
          :showPopoutIcon="false"
          :showMaximiseIcon="false"
          :showCloseIcon="false"
          :headerHeight="22"
          :dragProxyHeight="0"
          v-model="layoutState"
        >
          <!-- We would want to disable the drop proxy entirely, but that is not yet possible: https://github.com/golden-layout/golden-layout/issues/466 -->
          <gl-row :closeable="false">
            <gl-component
              :title="$t('panels.scene.title')"
              :closable="false"
              :reorderEnabled="false"
              :width="60"
              @resize="onSceneResize"
            >
              <Playground
                ref="playground"
                @askDeleteSelectedObject="
                  $refs.propertyEditor.deleteKeyPressed()
                "
                @focusSelectedObject="focusSelectedObject"
              />
            </gl-component>

            <gl-col :width="17">
              <gl-component
                :title="$t('panels.objectList.title')"
                :closable="false"
                :height="70"
              >
                <ObjectList ref="objectList" />
              </gl-component>
              <gl-component
                :title="$t('panels.classList.title')"
                :closable="false"
                :height="30"
              >
                <ClassList />
              </gl-component>
            </gl-col>
            <gl-stack :width="23">
              <gl-component
                :title="$t('panels.properties.title')"
                :closable="false"
              >
                <div class="panel">
                  <h1>Properties</h1>
                </div>
              </gl-component>
              <gl-component :title="$t('panels.json.title')" :closable="false">
                <PropertyEditor
                  ref="propertyEditor"
                  @focusSelectedObject="focusSelectedObject"
                />
              </gl-component>
            </gl-stack>
          </gl-row>
        </golden-layout>
        <!--        <Split @onDrag="onDrag">
          <SplitArea :size="60">
            <Playground
              ref="playground"
              @askDeleteSelectedObject="$refs.propertyEditor.deleteKeyPressed()"
            />
          </SplitArea>
          <SplitArea :size="17">
            <Split direction="vertical">
              <SplitArea :size="70">
                <ObjectList ref="objectList" />
              </SplitArea>
              <SplitArea :size="30">
                <ClassList />
              </SplitArea>
            </Split>
          </SplitArea>
          <SplitArea :size="23">
            <PropertyEditor ref="propertyEditor" @focusSelectedObject="focusSelectedObject" />
          </SplitArea>
        </Split>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// @ is an alias to /src
import Menubar from '../web/Menubar.vue';
import Playground from './Playground.vue';
import ObjectList from './ObjectList.vue';
import PropertyEditor from './PropertyEditor.vue';
import ClassList from './ClassList.vue';
import { mapState } from 'vuex';
import { isElectron } from '../../ts/isElectron';

import Persistance from 'vue-storage-decorator';
const Persist = Persistance('EditorLayout');

@Component({
  components: {
    Menubar,
    Playground,
    ObjectList,
    PropertyEditor,
    ClassList
  }
})
export default class Editor extends Vue {
  @Prop({ default: !isElectron() }) showMenubar!: boolean;
  @Persist() layoutState: any = null;

  onSceneResize() {
    // todo handle via vuex / EventBus
    (this.$refs.playground as any).handleResize();
  }
  focusSelectedObject() {
    // todo handle via vuex / EventBus
    (this.$refs.playground as any).focusSelectedObject();
    (this.$refs.objectList as any).focusSelectedObject();
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
