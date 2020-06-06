<template>
  <div>
    <span class="label">{{ value.name }}</span>
    {{ value.type }}
    <IntPropertyDrawer
      v-if="value.type === 'IntProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <FloatPropertyDrawer
      v-else-if="value.type === 'FloatProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <ObjectPropertyDrawer
      v-else-if="value.type === 'ObjectProperty'"
      :path="path + '.value'"
      :value="value.value"
    />
    <BoolPropertyDrawer
      v-else-if="value.type === 'BoolProperty'"
      :path="path + '.value'"
      :value="value.value"
    />

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
@VueComponent({
  components: {
    IntPropertyDrawer,
    FloatPropertyDrawer,
    ObjectPropertyDrawer,
    BoolPropertyDrawer
  }
})
export default class PropertyPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: Property;
  @Prop() label!: string;
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
</style>
