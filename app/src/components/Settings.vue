<template>
  <div class="settings">
    <h3>{{ $t('settings.graphicsSectionTitle') }}</h3>
    <md-checkbox :model="showMap" @change="updateShowMap">{{
      $t('settings.showMap')
    }}</md-checkbox>
    <md-checkbox :model="showModels" @change="updateShowModels">{{
      $t('settings.showModels')
    }}</md-checkbox>
    <md-checkbox :model="showCustomPaints" @change="updateShowCustomPaints">{{
      $t('settings.showCustomPaints')
    }}</md-checkbox>
    <h4>{{ $t('settings.advancedSectionTitle') }}</h4>
    <md-field>
      <label>{{ $t('settings.farPlane') }}</label>
      <md-input
        :value="farPlane"
        @input="updateFarPlane"
        type="number"
      ></md-input>
      <span class="md-helper-text">{{ $t('settings.farPlaneHelp') }}</span>
    </md-field>
    <md-field>
      <label>{{ $t('settings.nearPlane') }}</label>
      <md-input
        :value="nearPlane"
        @input="updateNearPlane"
        type="number"
      ></md-input>
      <span class="md-helper-text">{{ $t('settings.nearPlaneHelp') }}</span>
    </md-field>

    <md-field>
      <label>{{ $t('settings.conveyorBeltResolution') }}</label>
      <md-input
        :value="conveyorBeltResolution"
        @input="updateConveyorBeltResolution"
        type="number"
      ></md-input>

      <span class="md-helper-text">{{
        $t('settings.conveyorBeltResolutionHelp')
      }}</span>
    </md-field>
    <md-checkbox :model="saveAsZip" @change="setSaveAsZip">
      {{ $t('settings.saveAsZip') }}
    </md-checkbox>

    <br />
    <h3 class="clickable" @click="toggleShowDevelopSettings">
      {{ $t('settings.developSectionTitle') }}
      <md-icon v-if="showDevelopSettings">expand_less</md-icon>
      <md-icon v-else>expand_more</md-icon>
    </h3>

    <div v-if="showDevelopSettings">
      <md-checkbox :model="editClassColors" @change="updateEditClassColors">{{
        $t('settings.editClassColors')
      }}</md-checkbox>
      <md-button class="md-raised" @click="exportClassColors">{{
        $t('settings.copyClassColorsButton')
      }}</md-button>
      <md-button class="md-raised" @click="clearClassColors">{{
        $t('settings.clearClassColorsButton')
      }}</md-button>

      <md-checkbox
        :model="experimentalFeatures"
        @change="updateExperimentalFeatures"
        >{{ $t('settings.experimentalFeatures') }}</md-checkbox
      >

      <md-field>
        <label>{{ $t('settings.autoLoadSaveFile') }}</label>
        <md-input
          :value="autoLoadSaveFile"
          @input="updateAutoLoadSaveFile"
        ></md-input>
      </md-field>

      <md-checkbox :model="showFps" @change="setShowFps">{{
        $t('settings.showFps')
      }}</md-checkbox>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import copyToClipboard from '@/ts/copyToClipboard';
export default {
  name: 'Settings',
  computed: {
    ...mapState('settings', [
      'nearPlane',
      'farPlane',
      'showModels',
      'showCustomPaints',
      'showMap',
      'conveyorBeltResolution',
      'classColors',
      'editClassColors',
      'experimentalFeatures',
      'autoLoadSaveFile',
      'showFps',
      'saveAsZip',
      'showDevelopSettings'
    ])
  },
  methods: {
    ...mapActions('settings', [
      'setNearPlane',
      'setFarPlane',
      'setShowModels',
      'setShowCustomPaints',
      'setShowMap',
      'setConveyorBeltResolution',
      'setEditClassColors',
      'clearClassColors',
      'setExperimentalFeatures',
      'setAutoLoadSaveFile',
      'setShowFps',
      'setSaveAsZip',
      'setShowDevelopSettings'
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
      copyToClipboard(JSON.stringify(this.classColors));
    },
    updateExperimentalFeatures(value) {
      this.setExperimentalFeatures(value);
    },
    updateAutoLoadSaveFile(value) {
      this.setAutoLoadSaveFile(value);
    },
    toggleShowDevelopSettings() {
      this.setShowDevelopSettings(!this.showDevelopSettings);
    }
  }
};
</script>
<style lang="css" scoped>
.settings {
  width: 400px;
}
.settings >>> .md-checkbox {
  display: flex !important;
}

.clickable {
  cursor: pointer;
  user-select: none;
}
</style>
