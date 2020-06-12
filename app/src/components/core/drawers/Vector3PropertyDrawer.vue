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
import {
  Component as VueComponent,
  Vue,
  Prop,
  Watch
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
@VueComponent({})
export default class Vector3PropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: any; //number[];
  // x,y,z object or 3 number array
  @Prop({ default: false }) named!: boolean;
  @Action('updateObjectValue') updateObjectValue: any;

  get xVal() {
    return this.named ? this.value.x : this.value[0];
  }
  get yVal() {
    return this.named ? this.value.y : this.value[1];
  }
  get zVal() {
    return this.named ? this.value.z : this.value[2];
  }

  changeX(value: string) {
    this.updateObjectValue({
      path: this.path + (this.named ? '.x' : '.0'),
      value: parseFloat(value)
    });
  }

  changeY(value: string) {
    this.updateObjectValue({
      path: this.path + (this.named ? '.y' : '.1'),
      value: parseFloat(value)
    });
  }

  changeZ(value: string) {
    this.updateObjectValue({
      path: this.path + (this.named ? '.z' : '.2'),
      value: parseFloat(value)
    });
  }
}
</script>

<style lang="scss" scoped></style>
