<template>
  <v-dialog
    width="600"
    :value="value"
    @input="
      newValue => {
        this.$emit('input', newValue);
      }
    "
  >
    <v-card tile>
      <v-card-title v-text="title"></v-card-title>
      <v-card-text v-html="content"></v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="choose(false)">{{ $t('general.no') }}</v-btn>
        <v-btn text @click="choose(true)" color="primary">{{
          $t('general.yes')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

/**
 * Simple component for a confirm dialog that also reacts to ESC and Enter
 */
@Component({})
export default class ConfirmDialog extends Vue {
  @Prop() value!: boolean;
  @Prop() title!: string;
  @Prop() content!: string;

  @Watch('value') valueChange(newVal: boolean) {
    if (newVal) {
      document.addEventListener('keyup', this.onEnterPressed);
    } else {
      document.removeEventListener('keyup', this.onEnterPressed);
    }
  }

  onEnterPressed(e: any) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      this.choose(true);
    }
  }
  choose(value: boolean) {
    this.$emit('input', false);
    if (value) {
      this.$emit('confirm');
    }
  }
}
</script>

<style></style>
