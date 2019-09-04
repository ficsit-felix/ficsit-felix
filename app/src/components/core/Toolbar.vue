<template>
  <div class="toolbar">
    <div class="section">
      <a @mousedown.stop="$emit('setTranslate')" :class="{ active: translateActive }">
        {{ $t('toolbar.translate')
        }}
        <md-tooltip md-direction="bottom" md-delay="500">G</md-tooltip>
      </a>
      <a @mousedown.stop="$emit('setRotate')" :class="{ active: rotateActive }">
        {{ $t('toolbar.rotate')
        }}
        <md-tooltip md-direction="bottom" md-delay="500">R</md-tooltip>
      </a>
      <a @mousedown.stop="$emit('setScale')" :class="{ active: scaleActive }">
        {{ $t('toolbar.scale')
        }}
        <md-tooltip md-direction="bottom" md-delay="500">S</md-tooltip>
      </a>
    </div>
    <div class="section">
      <a @mousedown.stop="$emit('setWorld')" :class="{ active: worldActive }">
        {{ $t('toolbar.world')
        }}
        <md-tooltip md-direction="bottom" md-delay="500">W</md-tooltip>
      </a>
      <a @mousedown.stop="$emit('setLocal')" :class="{ active: localActive }">
        {{ $t('toolbar.local')
        }}
        <md-tooltip md-direction="bottom" md-delay="500">L</md-tooltip>
      </a>
    </div>
    <div class="spacer"></div>
    <span @click="$emit('reportBug')" style="cursor: pointer;margin-right: 10px;">
      <md-icon class="bugReportIcon">bug_report</md-icon>
      <md-tooltip md-direction="bottom" md-delay="500">
        {{
        $t('toolbar.reportBug')
        }}
      </md-tooltip>
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
    display: inline-block;
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

  .md-icon.bugReportIcon {
    color: #aa4444aa;
  }
  span:hover .md-icon.bugReportIcon {
    color: #d44;
  }
}
.spacer {
  flex-grow: 1;
}
</style>
