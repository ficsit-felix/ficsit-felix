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

  changeX(value: string) {
    this.updateObjectValue({
      path: this.path + '.0',
      value: parseFloat(value)
    });
  }

  changeY(value: string) {
    this.updateObjectValue({
      path: this.path + '.1',
      value: parseFloat(value)
    });
  }

  changeZ(value: string) {
    this.updateObjectValue({
      path: this.path + '.2',
      value: parseFloat(value)
    });
  }
}
</script>

<style lang="scss" scoped>
.label {
  color: #ffcc80;
}
</style>
