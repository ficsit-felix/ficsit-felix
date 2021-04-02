<template>
  <div>
    <div style="display: flex">
      <span class="label">{{ value.name }}</span>
      <v-spacer></v-spacer>
      <i>{{ value.type }}</i>
    </div>
    <!-- IntProperty -->
    <IntPropertyDrawer
      v-if="value.type === 'IntProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- BoolProperty -->
    <BoolPropertyDrawer
      v-else-if="value.type === 'BoolProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- FloatProperty -->
    <FloatPropertyDrawer
      v-else-if="value.type === 'FloatProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- StrProperty, NameProperty -->
    <StringPropertyDrawer
      v-else-if="value.type === 'StrProperty' || value.type === 'NameProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- TextProperty -->
    <TextPropertyDrawer
      v-else-if="value.type === 'TextProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- ByteProperty -->
    <BytePropertyDrawer
      v-else-if="value.type === 'ByteProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- EnumProperty -->
    <EnumPropertyDrawer
      v-else-if="value.type === 'EnumProperty'"
      :path="path + '.value'"
      :value="value.value"
    />

    <!-- ObjectProperty, InterfaceProperty -->
    <ObjectPropertyDrawer
      v-else-if="
        value.type === 'ObjectProperty' || value.type === 'InterfaceProperty'
      "
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- StructProperty -->
    <StructPropertyDrawer
      v-else-if="value.type === 'StructProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- ArrayProperty, SetProperty -->
    <ArrayPropertyDrawer
      v-else-if="value.type === 'ArrayProperty' || value.type === 'SetProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- MapProperty -->
    <MapPropertyDrawer
      v-else-if="value.type === 'MapProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- Int64Property -->
    <StringPropertyDrawer
      v-else-if="value.type === 'Int64Property'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- Int8Property -->
    <IntPropertyDrawer
      v-else-if="value.type === 'Int8Property'"
      :path="path + '.value'"
      :value="value.value"
    />
    <div v-else class="err">unsupported property {{ value.type }}</div>
  </div>
</template>

<script lang="ts">
import { Property } from 'satisfactory-json';
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import ArrayPropertyDrawer from './ArrayPropertyDrawer.vue';
import BoolPropertyDrawer from './BoolPropertyDrawer.vue';
import BytePropertyDrawer from './BytePropertyDrawer.vue';
import EnumPropertyDrawer from './EnumPropertyDrawer.vue';
import FloatPropertyDrawer from './FloatPropertyDrawer.vue';
import IntPropertyDrawer from './IntPropertyDrawer.vue';
import MapPropertyDrawer from './MapPropertyDrawer.vue';
import ObjectPropertyDrawer from './ObjectPropertyDrawer.vue';
import StringPropertyDrawer from './StringPropertyDrawer.vue';
import StructPropertyDrawer from './StructPropertyDrawer.vue';
import TextPropertyDrawer from './TextPropertyDrawer.vue';

@VueComponent({
  components: {
    IntPropertyDrawer,
    FloatPropertyDrawer,
    ObjectPropertyDrawer,
    BoolPropertyDrawer,
    StringPropertyDrawer,
    StructPropertyDrawer,
    ArrayPropertyDrawer,
    BytePropertyDrawer,
    MapPropertyDrawer,
    TextPropertyDrawer,
    EnumPropertyDrawer
  }
})
export default class PropertyPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: Property;
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
</style>
