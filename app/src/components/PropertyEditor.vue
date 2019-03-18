<template>
  <div class="property-editor">
    <div class="buttons">
      <md-button
        class="md-raised"
        :disabled="this.selectedObject == null"
        @click="focusSelectedObject"
        >Focus</md-button
      >
      <md-button
        class="md-raised md-accent"
        :disabled="this.selectedObject == null"
        @click="saveJson"
        >Save JSON</md-button
      >
    </div>
    <md-field :class="jsonClass">
      <label>JSON</label>
      <md-textarea
        v-model="selectedJson"
        :disabled="this.selectedJson == ''"
        rows="200"
      ></md-textarea>
      <span class="md-error">{{ jsonError }}</span>
    </md-field>

    <md-snackbar :md-duration="1000" :md-active.sync="showSnackbar"
      >Object saved.</md-snackbar
    >
  </div>
</template>

<style lang="scss">
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

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "PropertyEditor",
  data: function() {
    return {
      selectedJson: "",
      jsonClass: "",
      jsonError: "",
      showSnackbar: false
    };
  },
  computed: {
    ...mapState(["selectedIndex", "selectedObject"])
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
    selectedObject: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log("SELECTED CHANGED", val);
        if (this.selectedObject == null) {
          this.selectedJson = "";
        } else {
          this.selectedJson = JSON.stringify(this.selectedObject, null, 2);

          this.jsonClass = "";
          this.jsonError = "";
        }
      }
    }
  },

  methods: {
    ...mapActions(["setSelectedObject"]),
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
    }
  }
};
</script>
