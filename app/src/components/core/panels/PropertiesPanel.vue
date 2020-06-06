<template>
  <div class="panel">
    <div v-if="selectedActors.length === 1 && selectedComponents.length === 0">
      edit actor
      {{ selectedActors[0].pathName }}
      {{ selectedActors[0].className }}
      <Vector3PropertyDrawer
        label="Translation"
        path="selectedActors.0.transform.translation"
        :value="selectedActors[0].transform.translation"
      />
      <Vector3PropertyDrawer
        label="Scale"
        path="selectedActors.0.transform.scale3d"
        :value="selectedActors[0].transform.scale3d"
      />
    </div>
    <div
      v-else-if="selectedActors.length === 0 && selectedComponents.length === 1"
    >
      edit component
      {{ selectedComponents[0].pathName }}
      {{ selectedComponents[0].className }}
    </div>
    <div v-else>select something to edit</div>
    {{ selectedActors }}
    {{ selectedComponents }}
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Actor, Component } from 'satisfactory-json';
import Vector3PropertyDrawer from '../drawers/Vector3PropertyDrawer.vue';

@VueComponent({
  components: {
    Vector3PropertyDrawer
  }
})
export default class PropertiesPanel extends Vue {
  @State(state => state.selectedActors)
  selectedActors!: Actor[];
  @State(state => state.selectedComponents)
  selectedComponents!: Component[];
}
</script>

<style lang="scss" scoped></style>
