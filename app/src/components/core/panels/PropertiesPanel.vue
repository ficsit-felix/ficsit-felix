<template>
  <div class="panel">
    <div
      v-if="
        selectedPathNames.length === 1 &&
          selectedPathNames[0] === '---save-header---'
      "
    >
      <div class="header">___Save_Header___</div>
    </div>
    <div
      v-else-if="selectedActors.length === 1 && selectedComponents.length === 0"
    >
      <div class="header">
        {{ formatPathName(selectedActors[0].pathName) }}
      </div>

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
    <div v-else-if="selectedActors.length > 1">
      multiple actors selected

      <span class="label">Translation</span>
      <MultiTranslateDrawer :value="center" />
    </div>
    <div v-else>select something to edit</div>
  </div>
</template>

<script lang="ts">
import { Actor, Component } from 'satisfactory-json';
import { Component as VueComponent, Vue, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import BoolPropertyDrawer from '../drawers/BoolPropertyDrawer.vue';
import MultiTranslateDrawer from '../drawers/MultiTranslateDrawer.vue';
import PropertyPropertyDrawer from '../drawers/PropertyPropertyDrawer.vue';
import QuaternionPropertyDrawer from '../drawers/QuaternionPropertyDrawer.vue';
import Vector3PropertyDrawer from '../drawers/Vector3PropertyDrawer.vue';

@VueComponent({
  components: {
    Vector3PropertyDrawer,
    QuaternionPropertyDrawer,
    PropertyPropertyDrawer,
    BoolPropertyDrawer,
    MultiTranslateDrawer
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

  // display center point when multiple actors are selected
  center: number[] = [0, 0, 0];

  @Watch('selectedActors', { deep: true }) // deep:true needed to update when the actors are moved using the helper
  onSelectedActorsChange(val: any) {
    if (val.length > 1) {
      this.center = [0, 0, 0];
      val.forEach((actor: Actor) => {
        this.center[0] += actor.transform.translation[0];
        this.center[1] += actor.transform.translation[1];
        this.center[2] += actor.transform.translation[2];
      });
      this.center[0] /= val.length;
      this.center[1] /= val.length;
      this.center[2] /= val.length;
    }
  }

  // Remove the level from the pathname
  formatPathName(pathName: string) {
    return pathName.substring(pathName.indexOf('.') + 1);
  }
}
</script>

<style lang="scss" scoped>
v-label {
  display: block;
}
.header {
  font-size: 16px;
  display: block;
}
a.link {
  display: block;
}
</style>
