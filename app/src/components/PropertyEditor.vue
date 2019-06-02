<template>
  <div class="property-editor">
    <div class="buttons">
      <md-button
        class="md-raised"
        :disabled="focusDisabled"
        @click="focusSelectedObject"
      >
        {{ $t("propertyEditor.focusButton") }}
        <md-tooltip md-delay="500">F</md-tooltip>
      </md-button>
      <md-button
        class="md-raised md-accent"
        :disabled="this.selectedJsonToEdit == null"
        @click="saveJson"
        >{{ $t("propertyEditor.saveJsonButton") }}</md-button
      >
      <div class="spacer"></div>
      <md-button
        class="md-raised md-primary"
        :disabled="
          this.selectedJsonToEdit == null ||
            (this.selectedPathNames.length === 1 &&
              this.selectedPathNames[0] === '---save-header---')
        "
        @click="showDeleteDialog = true"
        v-shortkey.once="['del']"
        @shortkey="deleteKeyPressed()"
      >
        {{ $t("propertyEditor.deleteButton") }}
        <md-tooltip md-delay="500">{{ $t("keyboard.del") }}</md-tooltip>
      </md-button>
    </div>
    <md-field :class="jsonClass">
      <label>{{ $t("propertyEditor.jsonLabel") }}</label>
      <md-textarea
        v-model="selectedJson"
        :disabled="this.selectedJson == ''"
        rows="200"
      ></md-textarea>
      <span class="md-error">{{ jsonError }}</span>
    </md-field>

    <md-snackbar :md-duration="1000" :md-active.sync="showSnackbar">{{
      $t("propertyEditor.objectSavedSnack")
    }}</md-snackbar>

    <md-dialog-confirm
      :md-active.sync="showDeleteDialog"
      :md-title="$t('dialog.delete.title')"
      :md-content="$t('dialog.delete.content')"
      :md-confirm-text="$t('general.yes')"
      :md-cancel-text="$t('general.no')"
      @md-cancel="showDeleteDialog = false"
      @md-confirm="deleteSelected"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "PropertyEditor",
  data: function() {
    return {
      selectedJson: "",
      jsonClass: "",
      jsonError: "",
      showSnackbar: false,
      showDeleteDialog: false
    };
  },
  computed: {
    ...mapState(["selectedJsonToEdit", "selectedActors", "selectedPathNames"]),
    focusDisabled() {
      return this.selectedActors.length !== 1;
    }
    // ...mapGetters(["getSelectedObject"])
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
          this.selectedJson = "";
        } else {
          this.selectedJson = JSON.stringify(this.selectedJsonToEdit, null, 2);

          this.jsonClass = "";
          this.jsonError = "";
        }
      }
    }
  },

  methods: {
    ...mapActions(["setSelectedObject", "deleteSelected"]),
    focusSelectedObject() {
      this.$emit("focusSelectedObject");
    },

    saveJson() {
      console.log("save json");
      try {
        var obj = JSON.parse(this.selectedJson);
        this.setSelectedObject(obj);
        this.jsonClass = "";
        this.jsonError = "";
        this.showSnackbar = true;
      } catch (e) {
        this.jsonClass = "md-invalid";
        this.jsonError = e;
      }
    },
    deleteKeyPressed() {
      if (
        this.selectedJsonToEdit !== null &&
        (this.selectedPathNames.length !== 1 ||
          this.selectedPathNames[0] !== "---save-header---")
      ) {
        this.showDeleteDialog = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.property-editor {
  /*width: 300px;
  flex-shrink: 0;*/
  background: $middleGray;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.buttons {
  flex-shrink: 0;
  display: flex;
}
.spacer {
  flex-grow: 1;
}
.json-editor {
  width: 100%;
  height: 100%;
  color: $textGray;
  border: 0px;
}
textarea {
  height: 100% !important;
  max-height: none !important;
  font-family: monospace !important;
}
</style>
