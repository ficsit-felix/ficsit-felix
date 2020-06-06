<template>
  <div>
    <v-text-field
      :value="value.levelName"
      hide-details
      outlined
      dense
      @change="changeLevelName"
      label="levelName"
      class="my-2"
    />
    <v-text-field
      :value="value.pathName"
      hide-details
      outlined
      dense
      @change="changePathName"
      label="pathName"
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
export default class ObjectPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: {
    levelName: string;
    pathName: string;
  };
  @Action('updateObjectValue') updateObjectValue: any;

  changeLevelName(value: string) {
    this.updateObjectValue({
      path: this.path + '.levelName',
      value: value
    });
  }
  changePathName(value: string) {
    this.updateObjectValue({
      path: this.path + '.pathName',
      value: value
    });
  }
}
</script>

<style lang="scss" scoped></style>
