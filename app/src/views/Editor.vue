<template>
  <div class="editor">
    <div class="maincolumn">
      <Toolbar />
      <div class="mainrow">
        <Playground />
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
import Playground from "@/components/Playground.vue";
import ObjectList from "@/components/ObjectList.vue";
import PropertyEditor from "@/components/PropertyEditor.vue";

export default {
  name: "editor",
  components: {
    Toolbar,
    Playground,
    ObjectList,
    PropertyEditor
  }
};
</script>
