<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          label="X"
          :value="euler.x * RAD2DEG"
          hide-details
          outlined
          dense
          @change="changeX"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Y"
          :value="euler.y * RAD2DEG"
          hide-details
          outlined
          dense
          @change="changeY"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Z"
          :value="euler.z * RAD2DEG"
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
import { Euler, Quaternion, MathUtils } from 'three';
@VueComponent({})
export default class QuaternionPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: any; // number[] | {x:number, y:number, z: number, w:number};
  // x,y,z,w object or 4 number array
  @Prop({ default: false }) named!: boolean;
  @Action('updateObjectValue') updateObjectValue: any;
  RAD2DEG = MathUtils.RAD2DEG;

  get euler() {
    // TODO do this without creating garbage?
    return new Euler().setFromQuaternion(
      this.named
        ? new Quaternion(this.value.x, this.value.y, this.value.z, this.value.w)
        : new Quaternion(
            this.value[0],
            this.value[1],
            this.value[2],
            this.value[3]
          )
    );
  }

  changeX(value: string) {
    const rot = this.euler;
    rot.x = parseFloat(value) * MathUtils.DEG2RAD;
    this.change(rot);
  }

  changeY(value: string) {
    const rot = this.euler;
    rot.y = parseFloat(value) * MathUtils.DEG2RAD;
    this.change(rot);
  }

  changeZ(value: string) {
    const rot = this.euler;
    rot.z = parseFloat(value) * MathUtils.DEG2RAD;
    this.change(rot);
  }

  change(euler: Euler) {
    const quat = new Quaternion().setFromEuler(euler);
    let newValue;
    if (this.named) {
      newValue = Object.assign({}, this.value); // to keep potential other members
      newValue.x = quat.x;
      newValue.y = quat.y;
      newValue.z = quat.z;
      newValue.w = quat.w;
    } else {
      newValue = [quat.x, quat.y, quat.z, quat.w];
    }
    this.updateObjectValue({
      path: this.path,
      value: newValue
    });
  }
}
</script>

<style lang="scss" scoped></style>
