<template>
  <div>
    <div style="display: flex">
      <span class="label">{{ value.name }}</span>
      <v-spacer></v-spacer>
      <i>{{ value.type }}</i>
    </div>
    <IntPropertyDrawer
      v-if="value.type === 'IntProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <BoolPropertyDrawer
      v-else-if="value.type === 'BoolProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <FloatPropertyDrawer
      v-else-if="value.type === 'FloatProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <StringPropertyDrawer
      v-else-if="value.type === 'StrProperty' || value.type === 'NameProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- TextProperty -->
    <!-- ByteProperty -->
    <!-- EnumProperty -->
    <ObjectPropertyDrawer
      v-else-if="
        value.type === 'ObjectProperty' || value.type === 'InterfaceProperty'
      "
      :path="path + '.value'"
      :value="value.value"
    />
    <StructPropertyDrawer
      v-else-if="value.type === 'StructProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <ArrayPropertyDrawer
      v-else-if="value.type === 'ArrayProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <!-- MapProperty -->
    <!-- SetProperty -->
    <!-- Int64Property -->
    <!-- Int8Property -->
    <div v-else class="err">unsupported property</div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue, Prop } from 'vue-property-decorator';
import { Property } from 'satisfactory-json';
import IntPropertyDrawer from './IntPropertyDrawer.vue';
import FloatPropertyDrawer from './FloatPropertyDrawer.vue';
import ObjectPropertyDrawer from './ObjectPropertyDrawer.vue';
import BoolPropertyDrawer from './BoolPropertyDrawer.vue';
import StringPropertyDrawer from './StringPropertyDrawer.vue';
import StructPropertyDrawer from './StructPropertyDrawer.vue';
import ArrayPropertyDrawer from './ArrayPropertyDrawer.vue';
@VueComponent({
  components: {
    IntPropertyDrawer,
    FloatPropertyDrawer,
    ObjectPropertyDrawer,
    BoolPropertyDrawer,
    StringPropertyDrawer,
    StructPropertyDrawer,
    ArrayPropertyDrawer
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
