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
    <ColorStructPropertyDrawer
      v-else-if="value.type === 'Color'"
      :value="value"
      :path="path"
    />
    <!-- LinearColor -->
    <LinearColorStructPropertyDrawer
      v-else-if="value.type === 'LinearColor'"
      :value="value"
      :path="path"
    />
    <!-- Quat -->
    <QuaternionPropertyDrawer
      v-else-if="value.type === 'Quat'"
      :path="path"
      :value="value"
      :named="true"
    />
    <!-- InventoryItem -->
    <InventoryItemStructPropertyDrawer
      v-else-if="value.type === 'InventoryItem'"
      :path="path"
      :value="value"
    />
    <!-- RailroadTrackPosition -->
    <RailroadTrackPositionStructPropertyDrawer
      v-else-if="value.type === 'RailroadTrackPosition'"
      :path="path"
      :value="value"
    />
    <!-- TimerHandle -->
    <StringPropertyDrawer
      v-else-if="value.type === 'TimerHandle'"
      :path="path + '.handle'"
      :value="value.handle"
    />
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
    <StringPropertyDrawer
      v-else-if="value.type === 'Guid'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- FluidBox -->
    <FloatPropertyDrawer
      v-else-if="value.type === 'FluidBox'"
      :path="path + '.handle'"
      :value="value.handle"
    />
    <!-- else: error -->
    <div v-else>
      <div class="err">unimplemented struct type {{ value.type }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import FloatPropertyDrawer from './FloatPropertyDrawer.vue';
import QuaternionPropertyDrawer from './QuaternionPropertyDrawer.vue';
import StringPropertyDrawer from './StringPropertyDrawer.vue';
import ArbitraryStructPropertyDrawer from './struct/ArbitraryStructPropertyDrawer.vue';
import BoxStructPropertyDrawer from './struct/BoxStructPropertyDrawer.vue';
import ColorStructPropertyDrawer from './struct/ColorStructPropertyDrawer.vue';
import InventoryItemStructPropertyDrawer from './struct/InventoryItemStructPropertyDrawer.vue';
import LinearColorStructPropertyDrawer from './struct/LinearColorStructPropertyDrawer.vue';
import RailroadTrackPositionStructPropertyDrawer from './struct/RailroadTrackPositionStructPropertyDrawer.vue';
import Vector3PropertyDrawer from './Vector3PropertyDrawer.vue';

@VueComponent({
  components: {
    ArbitraryStructPropertyDrawer,
    BoxStructPropertyDrawer,
    QuaternionPropertyDrawer,
    Vector3PropertyDrawer,
    LinearColorStructPropertyDrawer,
    InventoryItemStructPropertyDrawer,
    ColorStructPropertyDrawer,
    RailroadTrackPositionStructPropertyDrawer,
    StringPropertyDrawer,
    FloatPropertyDrawer
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
