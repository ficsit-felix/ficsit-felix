<template>
  <div class="settings">
    <div class="languageSelection">
      {{ $t('landingPage.language') }}:
      <LanguageSwitcher></LanguageSwitcher>
    </div>

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
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import copyToClipboard from '@/ts/copyToClipboard';
import LanguageSwitcher from './LanguageSwitcher';
import { isElectron } from '../../ts/isElectron';
import { MapType } from '../../store';

export default {
  name: 'Settings',
  components: {
    LanguageSwitcher
  },
  data: () => {
    return {
      MapType
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
      'showDevelopSettings'
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
