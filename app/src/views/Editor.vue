<template>
  <div class="editor">
    <div class="maincolumn">
      <Toolbar />
      <div class="mainrow">
        <Split @onDrag="onDrag">
          <SplitArea :size="60">
            <Playground ref="playground" />
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
            <PropertyEditor @focusSelectedObject="focusSelectedObject" />
          </SplitArea>a
        </Split>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";
.editor {
  height: 100%;
}

.maincolumn {
  display: flex;
  flex-flow: column;
  overflow: auto;
  height: 100%;
}
.toolbar {
  flex-grow: 0;
  flex-shrink: 0; 
  flex-basis: 0;
}
.mainrow {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  min-height: 0px; // needed for Firefox, else this can become HUUGE
}
.split {
  overflow: hidden !important;
}
.gutter {
  background-color: $toolbarGray !important;
}
</style>

<script>
// @ is an alias to /src
import Toolbar from "@/components/Toolbar.vue";
import Playground from "@/components/Playground.vue";
import ObjectList from "@/components/ObjectList.vue";
import PropertyEditor from "@/components/PropertyEditor.vue";
import ClassList from "@/components/ClassList.vue";
import { mapState } from "vuex";

export default {
  name: "editor",
  components: {
    Toolbar,
    Playground,
    ObjectList,
    PropertyEditor,
    ClassList
  },
  computed: {
    ...mapState(["dataLoaded"])
  },

  created() {
    if (!this.dataLoaded) {
      // The user needs to upload a file first
      this.$router.push("upload");
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
