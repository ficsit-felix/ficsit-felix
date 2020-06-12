<template>
  <div>
    <span class="label">min</span>
    <Vector3PropertyDrawer :path="path + '.min'" :value="value.min" />
    <span class="label">max</span>
    <Vector3PropertyDrawer :path="path + '.max'" :value="value.max" />

    <span class="label">isValid</span>
    <BoolPropertyDrawer :path="path + '.isValid'" :value="value.isValid" />
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Vue, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import BoolPropertyDrawer from '../BoolPropertyDrawer.vue';
import Vector3PropertyDrawer from '../Vector3PropertyDrawer.vue';
@VueComponent({
  components: {
    BoolPropertyDrawer,
    Vector3PropertyDrawer
  }
})
export default class BoxStructPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: boolean;
}
</script>

<style lang="scss" scoped></style>
