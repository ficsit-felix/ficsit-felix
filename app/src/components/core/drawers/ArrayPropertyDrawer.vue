<template>
  <div>
    <div class="toggle" @click="isVisible = !isVisible">
      {{ value.values.length }} Elements
      <v-icon v-if="isVisible">mdi-chevron-up</v-icon>
      <v-icon v-else>mdi-chevron-down</v-icon>
    </div>
    <div class="box" v-if="isVisible">
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
      <div v-if="value.type === 'ByteProperty'">
        <IntPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- FloatProperty -->
      <div v-if="value.type === 'FloatProperty'">
        <FloatPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- EnumProperty, StrProperty -->
      <div v-if="value.type === 'EnumProperty' || value.type === 'StrProperty'">
        <StringPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- TextProperty -->
      <div v-if="value.type === 'TextProperty'">
        <TextPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- ObjectProperty, InterfaceProperty -->
      <div
        v-else-if="
          value.type === 'ObjectProperty' || value.type === 'InterfaceProperty'
        "
      >
        <ObjectPropertyDrawer
          v-for="(value, index) in value.values"
          :key="index"
          :path="path + '.values.' + index"
          :value="value"
        />
      </div>
      <!-- StructProperty -->
      <div v-else-if="value.type === 'StructProperty'">
        {{ value.structName }}
        {{ value.structInnerType }}
        <!-- Guid -->
        <div v-if="value.structInnerType === 'Guid'">
          <StringPropertyDrawer
            v-for="(entry, index) in value.values"
            :key="index"
            :path="path + '.values.' + index"
            :value="value.values[index]"
          />
        </div>
        <!-- LinearColor -->
        <div v-else-if="value.structInnerType === 'LinearColor'">
          <LinearColorStructPropertyDrawer
            v-for="(entry, index) in value.values"
            :key="index"
            :path="path + '.values.' + index"
            :value="value.values[index]"
          />
        </div>
        <!-- else: just a list of properties -->
        <div v-else>
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
      </div>
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
import ObjectPropertyDrawer from './ObjectPropertyDrawer.vue';
import FloatPropertyDrawer from './FloatPropertyDrawer.vue';
import StringPropertyDrawer from './StringPropertyDrawer.vue';
import TextPropertyDrawer from './TextPropertyDrawer.vue';
import LinearColorStructPropertyDrawer from './struct/LinearColorStructPropertyDrawer.vue';

@VueComponent({
  components: {
    IntPropertyDrawer,
    ObjectPropertyDrawer,
    FloatPropertyDrawer,
    StringPropertyDrawer,
    TextPropertyDrawer,
    LinearColorStructPropertyDrawer,
    PropertyPropertyDrawer: () => import('./PropertyPropertyDrawer.vue')
  }
})
export default class ArrayPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // ArrayProperty.value

  isVisible: boolean = false;
  visible: boolean[] = [];

  toggleVisible(index: number) {
    Vue.set(
      this.visible,
      index,
      !(this.visible.length > index && this.visible[index])
    );
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
