<template>
  <div>
    <!-- Vector, Rotator -->
    <Vector3PropertyDrawer
      v-if="value.type === 'Vector' || value.type === 'Rotator'"
      :path="path"
      :value="value"
      :named="true"
    />
    <!-- Box -->
    <BoxStructPropertyDrawer
      v-else-if="value.type === 'Box'"
      :path="path"
      :value="value"
    />
    <!-- Color -->
    <!-- LinearColor -->
    <!-- Quat -->
    <QuaternionPropertyDrawer
      v-else-if="value.type === 'Quat'"
      :path="path"
      :value="value"
      :named="true"
    />
    <!-- InventoryItem -->
    <!-- RailroadTrackPosition -->
    <!-- TimerHandle -->
    <!-- Transform, RemovedInstanceArray, InventoryStack, ProjectileData, TrainSimulationData, ResearchData, Hotbar -->
    <ArbitraryStructPropertyDrawer
      v-else-if="
        [
          'Transform',
          'RemovedInstanceArray',
          'InventoryStack',
          'ProjectileData',
          'TrainSimulationData',
          'ResearchData',
          'Hotbar'
        ].includes(value.type)
      "
      :path="path"
      :value="value"
    />
    <!-- Guid -->
    <!-- FluidBox -->
    <!-- else: error -->
    <div v-else>
      <div class="err">unimplemented struct type {{ value.type }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component as VueComponent,
  Vue,
  Prop,
  Watch
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { StructProperty } from 'satisfactory-json';
import ArbitraryStructPropertyDrawer from './struct/ArbitraryStructPropertyDrawer.vue';
import BoxStructPropertyDrawer from './struct/BoxStructPropertyDrawer.vue';
import QuaternionPropertyDrawer from './QuaternionPropertyDrawer.vue';
import Vector3PropertyDrawer from './Vector3PropertyDrawer.vue';

@VueComponent({
  components: {
    ArbitraryStructPropertyDrawer,
    BoxStructPropertyDrawer,
    QuaternionPropertyDrawer,
    Vector3PropertyDrawer
  }
})
export default class StructPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // StructProperty.value
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
</style>
