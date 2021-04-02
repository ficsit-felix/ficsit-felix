<template>
  <div>
    <v-text-field
      :value="value"
      hide-details
      outlined
      dense
      @change="change"
      class="my-2"
    />
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@VueComponent({})
export default class IntPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: number;
  @Action('updateObjectValue') updateObjectValue: any;

  change(value: string) {
    this.updateObjectValue({
      path: this.path,
      value: parseInt(value)
    });
  }
}
</script>

<style lang="scss" scoped></style>
