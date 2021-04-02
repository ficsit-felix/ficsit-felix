<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          label="R"
          :value="value.r"
          hide-details
          outlined
          dense
          @change="changeR"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="G"
          :value="value.g"
          hide-details
          outlined
          dense
          @change="changeG"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="B"
          :value="value.b"
          hide-details
          outlined
          dense
          @change="changeB"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="A"
          :value="value.a"
          hide-details
          outlined
          dense
          @change="changeA"
        />
      </v-col>
      <v-col>
        <div
          class="preview"
          :style="{
            backgroundColor:
              'rgba(' +
              value.r * 255 +
              ',' +
              value.g * 255 +
              ',' +
              value.b * 255 +
              ',' +
              value.a +
              ')'
          }"
        ></div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@VueComponent({})
export default class LinearColorStructPropertyDrawer extends Vue {
  @Prop() path!: string;
  @Prop() value!: any;
  @Prop({ default: false }) named!: boolean;
  @Action('updateObjectValue') updateObjectValue: any;

  changeR(value: string) {
    this.updateObjectValue({
      path: this.path + '.r',
      value: parseFloat(value)
    });
  }

  changeG(value: string) {
    this.updateObjectValue({
      path: this.path + '.g',
      value: parseFloat(value)
    });
  }

  changeB(value: string) {
    this.updateObjectValue({
      path: this.path + '.b',
      value: parseFloat(value)
    });
  }

  changeA(value: string) {
    this.updateObjectValue({
      path: this.path + '.a',
      value: parseFloat(value)
    });
  }
}
</script>

<style lang="scss" scoped>
.preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ffffff3d;
  margin-top: 4px;
}
</style>
