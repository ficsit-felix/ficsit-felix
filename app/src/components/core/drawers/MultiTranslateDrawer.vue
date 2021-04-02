<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          label="X"
          :value="xVal"
          hide-details
          outlined
          dense
          @change="changeX"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Y"
          :value="yVal"
          hide-details
          outlined
          dense
          @change="changeY"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Z"
          :value="zVal"
          hide-details
          outlined
          dense
          @change="changeZ"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vector3 } from 'three';
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

/**
 * Vector3PropertyDrawer, but translates multiple actors at once
 */
@VueComponent({})
export default class MultiTranslateDrawer extends Vue {
  @Prop() value!: any; //number[];
  // @Action('updateObjectValue') updateObjectValue: any;
  @Action('translateMultipleActors') translateMultipleActors: any;

  get xVal() {
    return this.value[0];
  }
  get yVal() {
    return this.value[1];
  }
  get zVal() {
    return this.value[2];
  }

  changeX(value: string) {
    const distance = new Vector3(parseFloat(value) - this.value[0], 0, 0);
    this.translateMultipleActors(distance);
  }

  changeY(value: string) {
    const distance = new Vector3(0, parseFloat(value) - this.value[1], 0);
    this.translateMultipleActors(distance);
  }

  changeZ(value: string) {
    const distance = new Vector3(0, 0, parseFloat(value) - this.value[2]);
    this.translateMultipleActors(distance);
  }
}
</script>

<style lang="scss" scoped></style>
