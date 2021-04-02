<template>
  <div>
    <v-text-field
      v-if="value.historyType === 0"
      :value="value.sourceString"
      hide-details
      outlined
      dense
      @change="change"
      class="my-2"
    />
    <div class="err" v-else>
      TextProperty historyType {{ value.historyType }} not yet implemente
    </div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@VueComponent({})
export default class TextPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: string;
  @Action('updateObjectValue') updateObjectValue: any;

  change(value: string) {
    this.updateObjectValue({
      path: this.path + '.sourceString',
      value: value
    });
  }
}
</script>

<style lang="scss" scoped>
.err {
  color: #ff5252;
}
</style>
