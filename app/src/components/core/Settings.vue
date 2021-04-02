<template>
  <div class="settings">
    <div class="languageSelection">
      {{ $t('landingPage.language') }}
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <h3>{{ $t('settings.controlsSectionTitle') }}</h3>

    <v-radio-group
      :value="cameraType"
      @change="setCameraType"
      :label="$t('settings.cameraType.label')"
      hide-details
    >
      <v-radio
        :label="$t('settings.cameraType.orbit')"
        :value="CameraType.Orbit"
      ></v-radio>
      <v-radio
        :label="$t('settings.cameraType.fly')"
        :value="CameraType.Fly"
      ></v-radio>
      <v-radio
        :label="$t('settings.cameraType.flat')"
        :value="CameraType.Flat"
      ></v-radio>
    </v-radio-group>

    <v-checkbox
      :input-value="snapping"
      @change="setSnapping"
      :label="$t('settings.snapping')"
      hide-details
      class="mb-4"
    ></v-checkbox>

    <v-text-field
      :label="$t('settings.translationSnap')"
      :value="translationSnap"
      @change="setTranslationSnap"
      type="number"
    ></v-text-field>

    <v-text-field
      :label="$t('settings.rotationSnap')"
      :value="rotationSnap"
      @change="setRotationSnap"
      type="number"
    ></v-text-field>

    <h3>{{ $t('settings.graphicsSectionTitle') }}</h3>

    <v-radio-group
      :value="mapType"
      @change="setMapType"
      :label="$t('settings.mapType.label')"
      hide-details
    >
      <v-radio
        :label="$t('settings.mapType.none')"
        :value="MapType.None"
      ></v-radio>
      <v-radio
        :label="$t('settings.mapType.render')"
        :value="MapType.Render"
      ></v-radio>
      <v-radio
        :label="$t('settings.mapType.ingame')"
        :value="MapType.Ingame"
      ></v-radio>
    </v-radio-group>

    <v-checkbox
      hide-details
      :input-value="showModels"
      @change="updateShowModels"
      :label="$t('settings.showModels')"
    ></v-checkbox>
    <v-checkbox
      :input-value="showCustomPaints"
      @change="updateShowCustomPaints"
      :label="$t('settings.showCustomPaints')"
    ></v-checkbox>
    <h4>{{ $t('settings.advancedSectionTitle') }}</h4>

    <v-text-field
      :label="$t('settings.farPlane')"
      :value="farPlane"
      @input="updateFarPlane"
      :hint="$t('settings.farPlaneHelp')"
      type="number"
    ></v-text-field>

    <v-text-field
      :label="$t('settings.nearPlane')"
      :value="nearPlane"
      @input="updateNearPlane"
      type="number"
      :hint="$t('settings.nearPlaneHelp')"
    ></v-text-field>

    <v-text-field
      :label="$t('settings.conveyorBeltResolution')"
      :value="conveyorBeltResolution"
      @input="updateConveyorBeltResolution"
      type="number"
      :hint="$t('settings.conveyorBeltResolutionHelp')"
    ></v-text-field>

    <br />

    <!-- TODO use v-expansion-panel instead? -->
    <h3 class="clickable" @click="toggleShowDevelopSettings">
      {{ $t('settings.developSectionTitle') }}
      <v-icon v-if="showDevelopSettings">mdi-chevron-up</v-icon>
      <v-icon v-else>mdi-chevron-down</v-icon>
    </h3>

    <div v-if="showDevelopSettings">
      <v-checkbox
        :input-value="editClassColors"
        @change="updateEditClassColors"
        :label="$t('settings.editClassColors')"
      ></v-checkbox>
      <v-btn @click="exportClassColors" class="ma-2">{{
        $t('settings.copyClassColorsButton')
      }}</v-btn>
      <v-btn @click="clearClassColors" class="ma-2">{{
        $t('settings.clearClassColorsButton')
      }}</v-btn>

      <v-checkbox
        :input-value="experimentalFeatures"
        @change="updateExperimentalFeatures"
        :label="$t('settings.experimentalFeatures')"
        hide-details
        class="my-2"
      ></v-checkbox>

      <v-text-field
        :label="$t('settings.autoLoadSaveFile')"
        :value="autoLoadSaveFile"
        @input="updateAutoLoadSaveFile"
        hide-details
      ></v-text-field>

      <v-checkbox
        :input-value="showFps"
        @change="setShowFps"
        :label="$t('settings.showFps')"
        hide-details
      ></v-checkbox>

      <v-checkbox
        :input-value="showPropertiesPanel"
        @change="setShowPropertiesPanel"
        :label="$t('settings.showPropertiesPanel')"
        hide-details
      ></v-checkbox>
      <v-btn @click="resetSettings" class="ma-2">{{
        $t('settings.resetSettingsButton')
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import { CameraType, MapType } from '@/store/settings';
import copyToClipboard from '@lib/copyToClipboard';
import { mapActions, mapState } from 'vuex';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
  name: 'Settings',
  components: {
    LanguageSwitcher
  },
  data: () => {
    return {
      MapType,
      CameraType
    };
  },
  computed: {
    ...mapState('settings', [
      'nearPlane',
      'farPlane',
      'showModels',
      'showCustomPaints',
      'mapType',
      'conveyorBeltResolution',
      'classColors',
      'editClassColors',
      'experimentalFeatures',
      'autoLoadSaveFile',
      'showFps',
      'showDevelopSettings',
      'snapping',
      'translationSnap',
      'rotationSnap',
      'cameraType',
      'showPropertiesPanel'
    ])
  },
  methods: {
    ...mapActions('settings', [
      'setNearPlane',
      'setFarPlane',
      'setShowModels',
      'setShowCustomPaints',
      'setMapType',
      'setConveyorBeltResolution',
      'setEditClassColors',
      'clearClassColors',
      'setExperimentalFeatures',
      'setAutoLoadSaveFile',
      'setShowFps',
      'setShowDevelopSettings',
      'setSnapping',
      'setTranslationSnap',
      'setRotationSnap',
      'setCameraType',
      'setShowPropertiesPanel',
      'resetSettings'
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
<style lang="scss" scoped>
.clickable {
  cursor: pointer;
  user-select: none;
}

.languageSelection {
  display: flex;
  align-items: center;
}
</style>
