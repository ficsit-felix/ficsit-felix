<template>
  <div class="settings">
    <h3>Graphics</h3>
    <md-checkbox :model="showMap" @change="updateShowMap">Show map</md-checkbox>
    <md-checkbox :model="showModels" @change="updateShowModels"
      >Show models</md-checkbox
    >
    <md-checkbox :model="showCustomPaints" @change="updateShowCustomPaints"
      >Show custom paints</md-checkbox
    >
    <h4>Advanced</h4>
    <md-field>
      <label>Far Plane</label>
      <md-input
        :value="farPlane"
        @input="updateFarPlane"
        type="number"
      ></md-input>
      <span class="md-helper-text">How far away you can see objects</span>
    </md-field>
    <md-field>
      <label>Near Plane</label>
      <md-input
        :value="nearPlane"
        @input="updateNearPlane"
        type="number"
      ></md-input>
      <span class="md-helper-text">Near objects are cut away</span>
    </md-field>

    <md-field>
      <label>Conveyor Belt Resolution</label>
      <md-input
        :value="conveyorBeltResolution"
        @input="updateConveyorBeltResolution"
        type="number"
      ></md-input>

      <span class="md-helper-text"
        >High values can cause very low framerate</span
      >
    </md-field>
    <br />
    <h3>Develop</h3>

    <md-checkbox :model="editClassColors" @change="updateEditClassColors"
      >Edit class colors</md-checkbox
    >
    <md-button class="md-raised" @click="exportClassColors"
      >Copy class colors to clipboard</md-button
    >
    <md-button class="md-raised" @click="clearClassColors"
      >Clear class colors</md-button
    >
  </div>
</template>

<style lang="css" scoped>
.settings {
  width: 400px;
}
.settings >>> .md-checkbox {
  display:flex !important;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Settings",
  computed: {
    ...mapState("settings", [
      "nearPlane",
      "farPlane",
      "showModels",
      "showCustomPaints",
      "showMap",
      "conveyorBeltResolution",
      "classColors",
      "editClassColors"
    ])
  },
  methods: {
    ...mapActions("settings", [
      "setNearPlane",
      "setFarPlane",
      "setShowModels",
      "setShowCustomPaints",
      "setShowMap",
      "setConveyorBeltResolution",
      "setEditClassColors",
      "clearClassColors"
    ]),
    updateNearPlane(value) {
      this.setNearPlane(value);
    },
    updateFarPlane(value) {
      this.setFarPlane(value);
    },
    updateShowModels(value) {
      this.setShowModels(value);
    },
    updateShowCustomPaints(value) {
      this.setShowCustomPaints(value);
    },
    updateShowMap(value) {
      this.setShowMap(value);
    },
    updateConveyorBeltResolution(value) {
      if (value > 10) {
        value = 10;
      }
      if (value < 1) {
        value = 1;
      }
      this.setConveyorBeltResolution(value);
    },
    updateEditClassColors(value) {
      this.setEditClassColors(value);
    },
    exportClassColors() {
      var input = document.createElement("textarea");
      input.value = JSON.stringify(this.classColors);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  }
};
</script>
