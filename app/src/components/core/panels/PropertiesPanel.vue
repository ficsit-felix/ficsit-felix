<template>
  <div class="panel">
    <div
      v-if="
        selectedPathNames.length === 1 &&
          selectedPathNames[0] === '---save-header---'
      "
    >
      <v-label>___Save_Header___</v-label>
    </div>
    <div
      v-else-if="selectedActors.length === 1 && selectedComponents.length === 0"
    >
      <v-label>{{ formatPathName(selectedActors[0].pathName) }}</v-label>

      <span class="label">Translation</span>
      <Vector3PropertyDrawer
        path="selectedActors.0.transform.translation"
        :value="selectedActors[0].transform.translation"
      />

      <span class="label">Rotation</span>
      <QuaternionPropertyDrawer
        path="selectedActors.0.transform.rotation"
        :value="selectedActors[0].transform.rotation"
      />

      <span class="label">Scale</span>

      <Vector3PropertyDrawer
        path="selectedActors.0.transform.scale3d"
        :value="selectedActors[0].transform.scale3d"
      />

      <span class="label">Needs Transform</span>
      <BoolPropertyDrawer
        path="selectedActors.0.needTransform"
        :value="selectedActors[0].needTransform"
      />
      <span class="label">Was placed in level</span>
      <BoolPropertyDrawer
        path="selectedActors.0.wasPlacedInLevel"
        :value="selectedActors[0].wasPlacedInLevel"
      />
      <span class="label">Children</span>
      <a
        v-for="(child, index) in selectedActors[0].entity.children"
        :key="'child' + index"
        class="link"
        @click="select([child.pathName])"
        >{{ formatPathName(child.pathName) }}</a
      >

      <PropertyPropertyDrawer
        v-for="(property, index) in selectedActors[0].entity.properties"
        :key="'property' + index"
        :path="'selectedActors.0.entity.properties.' + index"
        :value="property"
      />
    </div>
    <div
      v-else-if="selectedActors.length === 0 && selectedComponents.length === 1"
    >
      <div class="header">
        {{ formatPathName(selectedComponents[0].pathName) }}
      </div>
      <span class="label">Parent</span>
      <a class="link" @click="select([selectedComponents[0].outerPathName])">{{
        formatPathName(selectedComponents[0].outerPathName)
      }}</a>

      <PropertyPropertyDrawer
        v-for="(property, index) in selectedComponents[0].entity.properties"
        :key="'property' + index"
        :path="'selectedComponents.0.entity.properties.' + index"
        :value="property"
      />
    </div>
    <div v-else>select something to edit</div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { Actor, Component } from 'satisfactory-json';
import Vector3PropertyDrawer from '../drawers/Vector3PropertyDrawer.vue';
import QuaternionPropertyDrawer from '../drawers/QuaternionPropertyDrawer.vue';
import PropertyPropertyDrawer from '../drawers/PropertyPropertyDrawer.vue';
import BoolPropertyDrawer from '../drawers/BoolPropertyDrawer.vue';

@VueComponent({
  components: {
    Vector3PropertyDrawer,
    QuaternionPropertyDrawer,
    PropertyPropertyDrawer,
    BoolPropertyDrawer
  }
})
export default class PropertiesPanel extends Vue {
  @State(state => state.selectedActors)
  selectedActors!: Actor[];
  @State(state => state.selectedComponents)
  selectedComponents!: Component[];
  @State(state => state.selectedPathNames)
  selectedPathNames!: string[];

  @Action('select')
  select: any;

  // Remove the level from the pathname
  formatPathName(pathName: string) {
    return pathName.substring(pathName.indexOf('.') + 1);
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 16px;
}
a.link {
  display: block;
}
</style>
