<template>
  <div>
    <span class="label">Properties</span>
    <div class="box">
      <PropertyPropertyDrawer
        v-for="(property, index) in value.properties"
        :key="index"
        :path="path + '.properties.' + index"
        :value="value.properties[index]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@VueComponent({
  components: {
    // because property drawer is recursive: https://stackoverflow.com/a/58875919
    PropertyPropertyDrawer: () => import('../PropertyPropertyDrawer.vue'),
  },
})
export default class BoolPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: any;
  @Action('updateObjectValue') updateObjectValue: any;

  change(value: boolean) {
    this.updateObjectValue({
      path: this.path,
      value: value ? 1 : 0,
    });
  }
}
</script>

<style lang="scss" scoped>
.box {
  border-left: 1px solid #444;
  padding-left: 4px;
  min-height: 16px;
}
</style>
