<template>
  <div>
    Elements
    <div class="box">
      <div v-if="value.type === 'IntProperty'">
        <IntPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- ByteProperty -->
      <!-- FloatProperty -->
      <!-- EnumProperty -->
      <!-- StrProperty -->
      <!-- TextProperty -->
      <!-- ObjectProperty -->
      <!-- StructProperty -->
      <!-- InterfaceProperty -->
      <div v-else>
        <div class="err">unimplemented array type {{ value.type }}</div>
      </div>
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
import IntPropertyDrawer from './IntPropertyDrawer.vue';

@VueComponent({ components: { IntPropertyDrawer } })
export default class ArrayPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // ArrayProperty.value
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
.box {
  border-left: 1px solid #444;
  padding-left: 4px;
  min-height: 16px;
}
</style>
