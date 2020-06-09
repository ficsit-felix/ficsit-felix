<template>
  <v-dialog
    width="700"
    :value="value"
    @input="
      newValue => {
        this.$emit('input', newValue);
      }
    "
    scrollable
  >
    <v-card>
      <v-card-title>{{ $t('dialog.help.title') }}</v-card-title>
      <v-card-text>
        <b>{{ $t('dialog.help.controlsTitle') }}</b>

        <table class="mb-4">
          <tr>
            <th>{{ $t('dialog.help.headerKey') }}</th>
            <th>{{ $t('dialog.help.headerAction') }}</th>
          </tr>
          <tr v-for="({ key, action }, index) in keymap" :key="index">
            <td>{{ key }}</td>
            <td>{{ action }}</td>
          </tr>
        </table>

        <b>{{ $t('dialog.help.warningTitle') }}</b>
        <p>{{ $t('dialog.help.changeJsonWarning') }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">{{
          $t('general.close')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component as VueComponent, Vue, Prop } from 'vue-property-decorator';

function key(key: any, action: any) {
  return { key, action };
}

@VueComponent({})
export default class HelpDialog extends Vue {
  @Prop() value!: boolean;

  // This array is a getter so that it is updated when the language is changed
  get keymap() {
    return [
      key(
        this.$t('keyboard.leftMouseButton'),
        this.$t('dialog.help.actions.select')
      ),
      key(
        this.$t('keyboard.middleMouseButton'),
        this.$t('dialog.help.actions.cameraPan')
      ),
      key(
        this.$t('keyboard.rightMouseButton'),
        this.$t('dialog.help.actions.cameraRotate')
      ),
      key(
        this.$t('keyboard.scrollWheel'),
        this.$t('dialog.help.actions.cameraZoom')
      ),
      key(
        this.$t('keyboard.arrowUp'),
        this.$t('dialog.help.actions.cameraPan')
      ),
      key(
        this.$t('keyboard.arrowDown'),
        this.$t('dialog.help.actions.cameraPan')
      ),
      key(
        this.$t('keyboard.arrowLeft'),
        this.$t('dialog.help.actions.cameraPan')
      ),
      key(
        this.$t('keyboard.arrowRight'),
        this.$t('dialog.help.actions.cameraPan')
      ),
      key('G', this.$t('toolbar.translate')),
      key('R', this.$t('toolbar.rotate')),
      key('S', this.$t('toolbar.scale')),
      key('W', this.$t('toolbar.world')),
      key('L', this.$t('toolbar.local')),
      key('F', this.$t('propertyEditor.focusButton')),
      key(this.$t('keyboard.del'), this.$t('propertyEditor.deleteButton')),
      key(this.$t('keyboard.ctrl') + '+O', this.$t('menubar.open')),
      key(this.$t('keyboard.ctrl') + '+O', this.$t('menubar.save')),
      key(this.$t('keyboard.ctrl') + '+Z', this.$t('menubar.undo')),
      key(
        this.$t('keyboard.ctrl') + '+' + this.$t('keyboard.shift') + '+Z',
        this.$t('menubar.redo')
      )
    ];
  }

  mounted() {
    this.keymap.push(
      key(this.$t('keyboard.shift'), this.$t('dialog.help.actions.shiftSelect'))
    );
    this.keymap.push(
      key(this.$t('keyboard.ctrl'), this.$t('dialog.help.actions.boxSelect'))
    );
  }

  close() {
    this.$emit('input', false);
  }
}
</script>

<style></style>
