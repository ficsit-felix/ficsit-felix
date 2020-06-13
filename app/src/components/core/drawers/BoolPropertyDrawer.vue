<template>
  <div>
    <v-checkbox
      :input-value="value === 1"
      @change="change"
      hide-details
      dense
      class="mt-0 mb-1"
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
export default class BoolPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: boolean;
  @Action('updateObjectValue') updateObjectValue: any;

  change(value: boolean) {
    this.updateObjectValue({
      path: this.path,
      value: value ? 1 : 0
    });
  }
}
</script>

<style lang="scss" scoped></style>
