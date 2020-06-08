<template>
  <div class="toolbar">
    <div class="section">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('setTranslate')"
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
            @mousedown.stop="$emit('setRotate')"
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
            @mousedown.stop="$emit('setScale')"
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
            @mousedown.stop="$emit('setWorld')"
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
            @mousedown.stop="$emit('setLocal')"
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

    <v-checkbox
      :input-value="snapping"
      @change="setSnapping"
      :label="$t('settings.snapping')"
      hide-details
      dense
      class="my-1"
    ></v-checkbox>

    <div class="spacer"></div>
    <span
      @click="$emit('reportBug')"
      style="cursor: pointer;margin-right: 10px;margin-top: 8px"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon class="bugReportIcon" v-on="on">mdi-bug</v-icon>
        </template>
        {{ $t('toolbar.reportBug') }}
      </v-tooltip>
    </span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { EventBus } from '@lib/event-bus';
import { FOCUS_SELECTED_OBJECT } from '@lib/constants';
export default {
  name: 'Toolbar',
  components: {},
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
      return this.selectedActors.length !== 1;
    }
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
    color: #aa444477;
  }
  span:hover .v-icon.bugReportIcon {
    color: #d44;
  }
}
.spacer {
  flex-grow: 1;
}
</style>
