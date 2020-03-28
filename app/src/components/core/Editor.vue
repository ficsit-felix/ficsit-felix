<template>
  <div class="editor">
    <div class="maincolumn">
      <Menubar v-if="showMenubar" />
      <div class="mainrow">
        <Split @onDrag="onDrag">
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
            <PropertyEditor
              ref="propertyEditor"
              @focusSelectedObject="focusSelectedObject"
            />
          </SplitArea>
        </Split>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menubar from '../web/Menubar.vue';
import Playground from './Playground.vue';
import ObjectList from './ObjectList.vue';
import PropertyEditor from './PropertyEditor.vue';
import ClassList from './ClassList.vue';
import { mapState } from 'vuex';
import { isElectron } from '../../ts/isElectron';

export default {
  name: 'editor',
  components: {
    Menubar,
    Playground,
    ObjectList,
    PropertyEditor,
    ClassList
  },
  computed: {
    ...mapState(['dataLoaded'])
  },
  data() {
    return {
      showMenubar: !isElectron()
    };
  },

  created() {
    if (!this.dataLoaded) {
      // The user needs to load a file first
      this.$router.push({
        name: 'landingpage'
      });
    }
  },
  methods: {
    onDrag() {
      this.$refs.playground.handleResize();
    },
    focusSelectedObject() {
      this.$refs.playground.focusSelectedObject();
      this.$refs.objectList.focusSelectedObject();
    }
  }
};
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
</style>

<style lang="scss">
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
