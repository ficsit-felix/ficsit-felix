<template>
  <div class="editor">
    <div class="maincolumn">
      <Toolbar />
      <div class="mainrow">
        <Scene />
        <ObjectList />
        <PropertyEditor />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.editor {
  height: 100%;
}
.maincolumn {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.mainrow {
  display: flex;
  flex-grow: 1;
}
</style>

<script>
// @ is an alias to /src
import Toolbar from "@/components/Toolbar.vue";
import Scene from "@/components/Scene.vue";
import ObjectList from "@/components/ObjectList.vue";
import PropertyEditor from "@/components/PropertyEditor.vue";

export default {
  name: "editor",
  components: {
    Toolbar,
    Scene,
    ObjectList,
    PropertyEditor
  }
};
</script>
