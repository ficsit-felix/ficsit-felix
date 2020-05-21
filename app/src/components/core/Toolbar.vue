<template>
  <div class="toolbar">
    <div class="section">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <a
            @mousedown.stop="$emit('setTranslate')"
            :class="{ active: translateActive }"
            v-on="on"
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
            >{{ $t('toolbar.local') }}</a
          >
        </template>
        <span>L</span>
      </v-tooltip>
    </div>
    <div class="spacer"></div>
    <span
      @click="$emit('reportBug')"
      style="cursor: pointer;margin-right: 10px;"
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
export default {
  name: 'Toolbar',
  components: {},
  props: ['mode', 'local'],
  computed: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  display: flex;
  position: absolute;
  top: 10px;
  .section {
    /*    display: inline-block;*/
    display: flex;
    padding: 10px;
  }
  a {
    padding: 5px 10px;
    margin: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff !important;
    text-shadow: 1px 1px 1px #000;
    border-radius: 20px;
    border: rgba(255, 255, 255, 0.2) solid 1px;
    cursor: pointer;
    &.active {
      background: rgba(255, 255, 255, 0.3);
      border: rgba(255, 255, 255, 0.4) solid 1px;
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
    background: rgba(255, 255, 255, 0.3);
  }

  .v-icon.bugReportIcon {
    color: #aa4444aa;
  }
  span:hover .v-icon.bugReportIcon {
    color: #d44;
  }
}
.spacer {
  flex-grow: 1;
}
</style>
