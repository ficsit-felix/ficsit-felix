<template>
  <div class="property-editor panel">
    <v-textarea
      class="json-editor"
      outlined
      :label="$t('propertyEditor.jsonLabel')"
      v-model="selectedJson"
      :disabled="this.selectedJson === ''"
      :error-messages="jsonError"
      style="height:100%"
    ></v-textarea>

    <div class="buttons">
      <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            class="ma-2"
            :disabled="focusDisabled"
            @click="focusSelectedObject"
            v-on="on"
          >{{ $t('propertyEditor.focusButton') }}</v-btn>
        </template>
        F
      </v-tooltip>-->
      <v-btn
        class="ma-2"
        color="secondary black--text"
        :disabled="this.selectedJsonToEdit == null"
        @click="saveJson"
        >{{ $t('propertyEditor.saveJsonButton') }}</v-btn
      >
      <div class="spacer"></div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary black--text"
            :disabled="
              selectedJsonToEdit == null ||
                (selectedPathNames.length === 1 &&
                  selectedPathNames[0] === '---save-header---')
            "
            @click="showDeleteDialog = true"
            class="ma-2"
            v-on="on"
          >
            <span>{{ $t('propertyEditor.deleteButton') }}</span>
          </v-btn>
        </template>
        {{ $t('keyboard.del') }}
      </v-tooltip>
    </div>
    <div v-if="experimentalFeatures">
      <v-btn
        @click="copyAsBlueprint"
        :disabled="copyAsBlueprintDisabled"
        class="ma-2"
        >{{ $t('propertyEditor.copyAsBlueprint') }}</v-btn
      >
    </div>

    <v-snackbar v-model="showSnackbar" :timeout="1000" :right="true">
      {{ $t('propertyEditor.objectSavedSnack') }}
    </v-snackbar>

    <ConfirmDialog
      v-model="showDeleteDialog"
      :title="$t('dialog.delete.title')"
      :content="$t('dialog.delete.content')"
      @confirm="deleteSelected()"
    ></ConfirmDialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { createBlueprintFromActors } from 'satisfactory-blueprint'; //"satisfactory-blueprint";
import copyToClipboard from '@/ts/copyToClipboard';
import ConfirmDialog from './ConfirmDialog.vue';
export default {
  name: 'PropertyEditor',
  components: {
    ConfirmDialog
  },
  data: function() {
    return {
      selectedJson: '',
      jsonError: [],
      showSnackbar: false,
      showDeleteDialog: false
    };
  },
  computed: {
    ...mapState(['selectedJsonToEdit', 'selectedActors', 'selectedPathNames']),
    ...mapState('settings', ['experimentalFeatures']),
    focusDisabled() {
      return this.selectedActors.length !== 1;
    },
    copyAsBlueprintDisabled() {
      return this.selectedActors.length < 2;
    }
    //  ...mapGetters(["getSelectedObject"])
    /*selectedJson() {
            if (this.getSelectedObject == null) {
                return "";
            } else {
                return JSON.stringify(this.getSelectedObject);
            }
        }*/
  },
  watch: {
    selectedJsonToEdit: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.selectedJsonToEdit == null) {
          this.selectedJson = '';
        } else {
          this.selectedJson = JSON.stringify(this.selectedJsonToEdit, null, 2);

          this.jsonError = [];
        }
      }
    }
  },

  methods: {
    ...mapActions(['setSelectedObject', 'deleteSelected']),
    focusSelectedObject() {
      this.$emit('focusSelectedObject');
    },

    saveJson() {
      console.log('save json');
      try {
        let obj = JSON.parse(this.selectedJson);
        this.setSelectedObject(obj);
        this.jsonError = [];
        this.showSnackbar = true;
      } catch (e) {
        this.jsonError = [e.message];
      }
    },
    deleteKeyPressed() {
      if (
        this.selectedJsonToEdit !== null &&
        (this.selectedPathNames.length !== 1 ||
          this.selectedPathNames[0] !== '---save-header---')
      ) {
        this.showDeleteDialog = true;
      }
    },
    copyAsBlueprint() {
      const blueprint = createBlueprintFromActors(
        this.selectedActors,
        window.data
      );
      console.log('blueprint', blueprint);
      copyToClipboard(JSON.stringify(blueprint));
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.property-editor {
  /*width: 300px;
  flex-shrink: 0;*/
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.buttons {
  flex-shrink: 0;
  display: flex;
  overflow: auto;
}
.spacer {
  flex-grow: 1;
}
.json-editor {
  width: 100%;
  height: 100%;
  /*color: $textGray;
  border: 0px;*/
}
::v-deep textarea {
  font-family: monospace !important;
}

// Bring textarea to full height
::v-deep .v-input__control,
::v-deep .v-input__slot {
  height: 100%;
}
</style>
