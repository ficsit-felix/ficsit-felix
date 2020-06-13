<template>
  <div>
    <v-text-field
      :value="value.enum"
      hide-details
      outlined
      dense
      @change="changeEnum"
      label="enum"
      class="my-2"
    />
    <v-text-field
      :value="value.value"
      hide-details
      outlined
      dense
      @change="changeValue"
      label="value"
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
import { ObjectProperty } from 'satisfactory-json';
@VueComponent({})
export default class EnumPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: {
    enum: string;
    value: string;
  };
  @Action('updateObjectValue') updateObjectValue: any;

  changeEnum(value: string) {
    this.updateObjectValue({
      path: this.path + '.enum',
      value: value
    });
  }
  changeValue(value: string) {
    this.updateObjectValue({
      path: this.path + '.value',
      value: value
    });
  }
}
</script>

<style lang="scss" scoped></style>
