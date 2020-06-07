<template>
  <div>
    <!-- Vector -->
    <!-- Rotator -->
    <!-- Box -->
    <!-- Color -->
    <!-- LinearColor -->
    <!-- Quat -->
    <!-- InventoryItem -->
    <!-- RailroadTrackPosition -->
    <!-- TimerHandle -->
    <ArbitraryStructPropertyDrawer
      v-if="
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
    <!-- Transform -->
    <!-- RemovedInstanceArray -->
    <!-- InventoryStack -->
    <!-- ProjectileData -->
    <!-- Guid -->
    <!-- TrainSimulationData -->
    <!-- FluidBox -->
    <!-- ResearchData -->
    <!-- SlateBrush -->
    <!-- Hotbar -->
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

@VueComponent({ components: { ArbitraryStructPropertyDrawer } })
export default class StructPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // StructProperty.value
  @Prop() label!: string;
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
</style>
