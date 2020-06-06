<template>
  <div>
    <span class="label">{{ label }}</span>
    <v-row>
      <v-col>
        <v-text-field
          label="X"
          :value="value[0]"
          hide-details
          outlined
          dense
          type="number"
          @change="changeX"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Y"
          :value="value[1]"
          hide-details
          outlined
          dense
          type="number"
          @change="changeY"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Z"
          :value="value[2]"
          hide-details
          outlined
          dense
          type="number"
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
  @Prop() value!: number[];
  @Prop() label!: string;
  @Action('updateObjectValue') updateObjectValue: any;

  @Watch('value') onValueChange(value: number[]) {
    console.log('change', value);
  }

  changeX(value: number) {
    this.updateObjectValue({ path: this.path + '.0', value });
  }

  changeY(value: number) {
    this.updateObjectValue({ path: this.path + '.1', value });
  }

  changeZ(value: number) {
    this.updateObjectValue({ path: this.path + '.2', value });
  }
}
</script>

<style lang="scss" scoped>
.label {
  color: #ffcc80;
}
</style>
