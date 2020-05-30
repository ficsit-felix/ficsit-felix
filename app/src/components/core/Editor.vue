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
          @state="changeLayout"
          :state="layout"
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
              <Playground
                ref="playground"
                @askDeleteSelectedObject="
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
                v-if="false"
              >
                <div class="panel">
                  <h1>Properties</h1>
                </div>
              </gl-component>
              <gl-component :title="$t('panels.json.title')" :closable="false">
                <PropertyEditor ref="propertyEditor" />
              </gl-component>
            </gl-stack>
          </gl-row>
        </golden-layout>
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

@Component({
  components: {
    Menubar,
    Playground,
    ObjectList,
    PropertyEditor,
    ClassList
  },
  computed: {
    ...mapState('settings', ['layout'])
  }
})
export default class Editor extends Vue {
  @Prop({ default: !isElectron() }) showMenubar!: boolean;

  changeLayout(layout: any) {
    this.$store.commit('settings/SET_LAYOUT', layout);
  }

  onSceneResize() {
    (this.$refs.playground as any).handleResize();
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
