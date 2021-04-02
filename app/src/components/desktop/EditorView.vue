<template>
  <div class="desktop-editor">
    <DesktopMenu :visible="menuVisible"></DesktopMenu>
    <Editor></Editor>
  </div>
</template>

<script lang="ts">
import { TOGGLE_MENU } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { Component as VueComponent, Vue } from 'vue-property-decorator';
import Editor from '../core/Editor.vue';
import DesktopMenu from './DesktopMenu.vue';

@VueComponent({
  components: {
    DesktopMenu,
    Editor
  }
})
export default class EditorView extends Vue {
  private menuVisible: boolean = false;

  mounted() {
    EventBus.$on(TOGGLE_MENU, () => {
      // TODO small animation?
      this.menuVisible = !this.menuVisible;
    });
  }

  beforeDestroy() {
    EventBus.$off(TOGGLE_MENU);
  }
}
</script>

<style scoped>
.desktop-editor {
  width: 100%;
  height: 100%;
}
</style>
