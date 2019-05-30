<template>
  <div class="settings">
    <!--<h3>Graphics</h3>-->
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
      "conveyorBeltResolution"
    ])
  },
  methods: {
    ...mapActions("settings", [
      "setNearPlane",
      "setFarPlane",
      "setShowModels",
      "setShowCustomPaints",
      "setShowMap",
      "setConveyorBeltResolution"
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
      this.setConveyorBeltResolution(value);
    }
  }
};
</script>
