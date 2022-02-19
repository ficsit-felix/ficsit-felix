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
export default class StringPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: string;
  @Action('updateObjectValue') updateObjectValue: any;

  change(value: string) {
    this.updateObjectValue({
      path: this.path,
      value: value,
    });
  }
}
</script>

<style lang="scss" scoped></style>
