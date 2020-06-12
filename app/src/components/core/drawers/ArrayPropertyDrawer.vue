<template>
  <div>
    Elements
    <div class="box">
      <!-- IntProperty -->
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
      <div v-else-if="value.type === 'StructProperty'">
        {{ value.structName }}
        {{ value.structInnerType }}
        <!-- Guid -->
        <!-- LinearColor -->
        <!-- else: just a list of properties -->
        <div v-for="(entry, index) in value.values" :key="index">
          <div class="toggle" @click="toggleVisible(index)">
            {{ index }}
            <v-icon v-if="visible.length > index && visible[index]"
              >mdi-chevron-up</v-icon
            >
            <v-icon v-else>mdi-chevron-down</v-icon>
          </div>
          <div v-if="visible.length > index && visible[index]">
            <PropertyPropertyDrawer
              v-for="(property, pIndex) in entry.properties"
              :key="pIndex"
              :path="path + '.values.' + index + '.properties.' + pIndex"
              :value="value.values[index].properties[pIndex]"
            />
          </div>
        </div>
      </div>
      <!-- InterfaceProperty -->
      <!-- else: error -->
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

@VueComponent({
  components: {
    IntPropertyDrawer,
    PropertyPropertyDrawer: () => import('./PropertyPropertyDrawer.vue')
  }
})
export default class ArrayPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // ArrayProperty.value

  visible: boolean[] = [];

  toggleVisible(index: number) {
    Vue.set(
      this.visible,
      index,
      !(this.visible.length > index && this.visible[index])
    );
    console.log(index, this.visible.length);
  }
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
.toggle {
  cursor: pointer;
}
</style>
