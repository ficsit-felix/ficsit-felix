<template>
  <div>
    <v-text-field
      label="Enum Name"
      :value="value.enumName"
      hide-details
      outlined
      dense
      @change="changeEnumName"
      class="my-2"
    />
    <v-text-field
      label="Value"
      :value="value.value"
      hide-details
      outlined
      dense
      @change="changeValue"
      class="my-2"
    />
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
@VueComponent({})
export default class BytePropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: number;
  @Action('updateObjectValue') updateObjectValue: any;

  changeEnumName(value: string) {
    this.updateObjectValue({
      path: this.path + '.enumName',
      value: value
    });
  }
  changeValue(value: string) {
    this.updateObjectValue({
      path: this.path + '.value',
      value: parseInt(value)
    });
  }
}
</script>

<style lang="scss" scoped></style>
