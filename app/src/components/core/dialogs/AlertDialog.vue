<template>
  <v-dialog
    width="600"
    :value="value"
    @input="
      (newValue) => {
        this.$emit('input', newValue);
      }
    "
  >
    <v-card tile>
      <v-card-title v-text="title"></v-card-title>
      <v-card-text v-html="content"></v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close()" color="primary">
          {{ $t('general.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component as VueComponent, Prop, Vue } from 'vue-property-decorator';

/**
 * Simple component for an alert dialog
 */
@VueComponent({})
export default class AlertDialog extends Vue {
  @Prop() value!: boolean;
  @Prop() title!: string;
  @Prop() content!: string;

  close() {
    this.$emit('input', false);
  }
}
</script>

<style></style>
