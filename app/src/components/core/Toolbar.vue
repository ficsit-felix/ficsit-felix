<template>
  <div
    class="toolbar"
    @mousedown.stop="/*prevent deselect when clicking on toolbar button*/"
  >
    <div class="section">
      <!--      <v-icon>mdi-axis-arrow</v-icon>
      <v-icon>mdi-rotate-orbit</v-icon>
      <v-icon>mdi-arrow-expand-all</v-icon>
      <v-icon>mdi-cube</v-icon>
      <v-icon>mdi-earth</v-icon>

      <v-icon>mdi-cube-scan</v-icon>-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('set-translate')"
            :class="{ active: translateActive }"
            v-on="on"
            v-ripple
            >{{ $t('toolbar.translate') }}</a
          >
        </template>
        <span>G</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('set-rotate')"
            :class="{ active: rotateActive }"
            v-on="on"
            v-ripple
            >{{ $t('toolbar.rotate') }}</a
          >
        </template>
        <span>R</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('set-scale')"
            :class="{ active: scaleActive }"
            v-on="on"
            v-ripple
            >{{ $t('toolbar.scale') }}</a
          >
        </template>
        <span>S</span>
      </v-tooltip>
    </div>
    <div class="section">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('set-world')"
            :class="{ active: worldActive }"
            v-on="on"
            v-ripple
            >{{ $t('toolbar.world') }}</a
          >
        </template>
        <span>W</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('set-local')"
            :class="{ active: localActive }"
            v-on="on"
            v-ripple
            >{{ $t('toolbar.local') }}</a
          >
        </template>
        <span>L</span>
      </v-tooltip>
    </div>

    <div class="section">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            small
            depressed
            :disabled="focusDisabled"
            @mousedown.stop="focusSelectedObject"
            v-on="on"
            >{{ $t('propertyEditor.focusButton') }}</v-btn
          >
        </template>
        F
      </v-tooltip>
    </div>

    <!--    <v-checkbox
      :input-value="snapping"
      @change="setSnapping"
      :label="$t('settings.snapping')"
      hide-details
      dense
      class="snapping-checkbox"
    ></v-checkbox>-->

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          class="icn-btn"
          v-ripple
          v-if="snapping"
          @click.stop="setSnapping(false)"
          >mdi-grid</v-icon
        >
        <v-icon
          v-on="on"
          class="icn-btn"
          v-ripple
          v-else
          @click="setSnapping(true)"
          >mdi-grid-off</v-icon
        >
      </template>
      {{ $t('settings.snapping') }}
    </v-tooltip>

    <div class="spacer"></div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="icn-btn" v-ripple @click="showPhotoMode = true"
          >mdi-camera</v-icon
        >
      </template>
      {{ $t('photoMode.title') }}
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          class="bugReportIcon icn-btn"
          v-ripple
          v-on="on"
          @click="$emit('report-bug')"
          >mdi-bug</v-icon
        >
      </template>
      {{ $t('toolbar.reportBug') }}
    </v-tooltip>

    <PhotoModeDialog v-model="showPhotoMode" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { EventBus } from '@lib/event-bus';
import { FOCUS_SELECTED_OBJECT } from '@lib/constants';
import PhotoModeDialog from './dialogs/PhotoModeDialog.vue';
export default {
  name: 'Toolbar',
  components: {
    PhotoModeDialog
  },
  props: ['mode', 'local'],
  computed: {
    ...mapState(['selectedActors']),
    ...mapState('settings', ['snapping']),
    translateActive() {
      return this.mode === 'translate';
    },
    rotateActive() {
      return this.mode === 'rotate';
    },
    scaleActive() {
      return this.mode === 'scale';
    },
    localActive() {
      return this.local;
    },
    worldActive() {
      return !this.local;
    },
    focusDisabled() {
      return this.selectedActors.length < 1;
    }
  },
  data: () => {
    return {
      showPhotoMode: false
    };
  },
  methods: {
    ...mapActions('settings', ['setSnapping']),
    focusSelectedObject() {
      EventBus.$emit(FOCUS_SELECTED_OBJECT);
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  background: #1d2223;
  border-radius: 0px 2px 2px 2px;
  width: 100%;
  display: flex;
  position: absolute;
  overflow: auto;
  .section {
    /*    display: inline-block;*/
    display: flex;
    padding: 8px 10px;
  }
  a {
    padding: 2px 10px;
    margin: 0px 4px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff !important;
    text-shadow: 1px 1px 1px #000;
    border-radius: 4px;
    border: rgba(255, 255, 255, 0) solid 1px;
    cursor: pointer;
    &.active {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      /*border: rgba(255, 255, 255, 0.4) solid 1px;*/
    }
    user-select: none;
  }
  a:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    text-decoration: none;
    &.active {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  a:active {
    /*background: rgba(255, 255, 255, 0.3);*/
  }

  .v-icon.bugReportIcon {
    color: #aa4444;
    &:hover {
      color: #d44;
    }
  }
}
.spacer {
  flex-grow: 1;
}

.icn-btn {
  width: 44px;
  height: 44px;
  padding: 4px;
  opacity: 0.4;
  &:hover {
    opacity: 1;
  }
}

.icn-btn::after {
  height: auto;
}
</style>
