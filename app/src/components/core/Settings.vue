<template>
  <div class="settings">
    <div class="languageSelection">
      {{ $t('landingPage.language') }}:
      <LanguageSwitcher></LanguageSwitcher>
    </div>

    <h3>{{ $t('settings.graphicsSectionTitle') }}</h3>
    <v-checkbox
      hide-details
      :input-value="showMap"
      @change="updateShowMap"
      :label="$t('settings.showMap')"
    ></v-checkbox>
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
    >
    </v-checkbox>
    <h4>{{ $t('settings.advancedSectionTitle') }}</h4>

    <v-text-field
      :label="$t('settings.farPlane')"
      :value="farPlane"
      @input="updateFarPlane"
      :hint="$t('settings.farPlaneHelp')"
      type="number"
    >
    </v-text-field>

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
      <md-icon v-if="showDevelopSettings">expand_less</md-icon>
      <md-icon v-else>expand_more</md-icon>
    </h3>

    <div v-if="showDevelopSettings">
      <v-checkbox
        hide-details
        :input-value="editClassColors"
        @change="updateEditClassColors"
        :label="$t('settings.editClassColors')"
      >
      </v-checkbox>
      <v-btn @click="exportClassColors">
        {{ $t('settings.copyClassColorsButton') }}
      </v-btn>
      <v-btn @click="clearClassColors">
        {{ $t('settings.clearClassColorsButton') }}
      </v-btn>

      <v-checkbox
        :input-value="experimentalFeatures"
        @change="updateExperimentalFeatures"
        :label="$t('settings.experimentalFeatures')"
        hide-details
      ></v-checkbox>

      <v-text-field
        :label="$t('settings.autoLoadSaveFile')"
        :value="autoLoadSaveFile"
        @input="updateAutoLoadSaveFile"
        hide-details
      >
      </v-text-field>

      <v-checkbox
        :input-value="showFps"
        @change="setShowFps"
        :label="$t('settings.showFps')"
      >
      </v-checkbox>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import copyToClipboard from '@/ts/copyToClipboard';
import LanguageSwitcher from './LanguageSwitcher';
import { isElectron } from '../../ts/isElectron';
export default {
  name: 'Settings',
  components: {
    LanguageSwitcher
  },
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
      console.log(value);
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
<style lang="scss" scoped>
.settings {
  /*width: 400px;
  @media (max-width: 500px) {
    width: 100%;
  }*/
}

.clickable {
  cursor: pointer;
  user-select: none;
}

.languageSelection {
  display: flex;
  align-items: center;
}
</style>

<style lang="css" scoped>
.settings >>> .md-checkbox {
  display: flex !important;
}
</style>
