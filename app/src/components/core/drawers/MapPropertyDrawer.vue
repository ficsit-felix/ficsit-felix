<template>
  <div>
    <div class="toggle" @click="isVisible = !isVisible">
      {{ value.values.length }} Elements
      <v-icon v-if="isVisible">mdi-chevron-up</v-icon>
      <v-icon v-else>mdi-chevron-down</v-icon>
    </div>
    <div class="box" v-if="isVisible">
      <div v-for="(entry, index) in value.values" :key="index">
        <div class="toggle" @click="toggleVisible(index)">
          {{ index }}
          <v-icon v-if="visible.length > index && visible[index]"
            >mdi-chevron-up</v-icon
          >
          <v-icon v-else>mdi-chevron-down</v-icon>
        </div>
        <div v-if="visible.length > index && visible[index]">
          key:
          <!-- IntProperty -->
          <IntPropertyDrawer
            v-if="value.keyType === 'IntProperty'"
            :path="path + '.values' + index + '.key'"
            :value="value.values[index].key"
          />
          <!-- ObjectProperty -->
          <ObjectPropertyDrawer
            v-if="value.keyType === 'ObjectProperty'"
            :path="path + '.values' + index + '.key'"
            :value="value.values[index].key"
          />
          <!-- StrProperty -->
          <StringPropertyDrawer
            v-if="value.keyType === 'StrProperty'"
            :path="path + '.values' + index + '.key'"
            :value="value.values[index].key"
          />
          <!-- else: error -->
          <div v-else>
            <div class="err">unimplemented struct type {{ value.type }}</div>
          </div>
          value:
          <!-- StructProperty -->
          <ArbitraryStructPropertyDrawer
            v-if="value.valueType === 'StructProperty'"
            :path="path + '.values' + index"
            :value="value.values[index]"
          />
          <!-- ByteProperty -->
          <IntPropertyDrawer
            v-if="value.valueType === 'ByteProperty'"
            :path="path + '.values' + index"
            :value="value.values[index]"
          />
          <!-- EnumByteProperty, StrProperty -->
          <StringPropertyDrawer
            v-if="
              value.valueType === 'StrProperty' ||
                value.valueType === 'EnumByteProperty'
            "
            :path="path + '.values' + index"
            :value="value.values[index]"
          />
          <!-- else: error -->
          <div v-else>
            <div class="err">unimplemented struct type {{ value.type }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import IntPropertyDrawer from './IntPropertyDrawer.vue';
import ObjectPropertyDrawer from './ObjectPropertyDrawer.vue';
import StringPropertyDrawer from './StringPropertyDrawer.vue';
import ArbitraryStructPropertyDrawer from './struct/ArbitraryStructPropertyDrawer.vue';

@VueComponent({
  components: {
    ArbitraryStructPropertyDrawer,
    IntPropertyDrawer,
    ObjectPropertyDrawer,
    StringPropertyDrawer
  }
})
export default class MapPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: { [id: string]: any }; // StructProperty.value
  isVisible = false;
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
