<template>
  <div class="menubar">
    <div
      @mouseover="logoAnimating = true"
      @mouseleave="logoAnimating = false"
      class="logoContainer"
    >
      <Logo :height="48" black="#a0a0a0" :animating="logoAnimating"></Logo>
    </div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showOpenDialog()"
          v-shortkey.once="['ctrl', 'o']"
          @shortkey="showOpenDialog()"
          v-on="on"
          v-ripple
        >
          <v-icon>mdi-home</v-icon>
          {{ $t('menubar.open') }}
        </span>
      </template>
      {{ $t('keyboard.ctrl') }}+O
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showSaveDialog()"
          v-shortkey.once="['ctrl', 's']"
          @shortkey="showSaveDialog()"
          v-on="on"
          v-ripple
        >
          <v-icon>mdi-content-save</v-icon>
          {{ $t('menubar.save') }}
        </span>
      </template>
      {{ $t('keyboard.ctrl') }}+S
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span
          class="menu-item"
          @click="showHelpDialog()"
          v-shortkey.once="['f1']"
          @shortkey="showHelpDialog()"
          v-on="on"
          v-ripple
        >
          <v-icon>mdi-help-circle</v-icon>
          {{ $t('menubar.help') }}
        </span>
      </template>
      F1
    </v-tooltip>
    <span class="menu-item" @click="showSettingsDialog()" v-ripple>
      <v-icon>mdi-cog</v-icon>
      {{ $t('menubar.settings') }}
    </span>
    <!-- because the other menu items are not always visible, define the shortkeys here -->
    <span v-shortkey.once="['ctrl', 'z']" @shortkey="undo"></span>
    <span v-shortkey.once="['ctrl', 'shift', 'z']" @shortkey="redo"></span>

    <div class="spacer"></div>

    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon left>mdi-menu</v-icon>
          {{ $t('menubar.more') }}
        </v-btn>
      </template>

      <v-list>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-list-item @click="undo" :disabled="undoDisabled" v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-undo</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('menubar.undo') }}</v-list-item-title>
            </v-list-item>
          </template>
          {{ $t('keyboard.ctrl') }}+Z
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-list-item @click="redo" :disabled="redoDisabled" v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-redo</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('menubar.redo') }}</v-list-item-title>
            </v-list-item>
          </template>
          {{ $t('keyboard.ctrl') }}+{{ $t('keyboard.shift') }}+Z
        </v-tooltip>

        <v-list-item @click="showOpenJsonDialog()">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.importJson') }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="showSaveJsonDialog()">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.exportJson') }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="openGithub()">
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.github') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showLicensesDialog()">
          <v-list-item-icon>
            <v-icon>mdi-view-headline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.openSource') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showAboutDialog()">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menubar.about') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {
  DIALOG_ABOUT,
  DIALOG_HELP,
  DIALOG_OPEN_JSON_WEB,
  DIALOG_OPEN_SOURCE,
  DIALOG_OPEN_WEB,
  DIALOG_SAVE_JSON_WEB,
  DIALOG_SAVE_WEB,
  DIALOG_SETTINGS
} from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { mapActions, mapGetters } from 'vuex';
import Logo from '../core/Logo.vue';

export default {
  name: 'Menubar',
  components: {
    Logo
  },
  data: function() {
    return {
      logoAnimating: false
    };
  },
  computed: {
    ...mapGetters('undo', ['undoDisabled', 'redoDisabled'])
  },
  methods: {
    ...mapActions('undo', ['undoLastAction', 'redoLastAction']),
    open() {
      this.$router.push('open/sav');
    },
    openJson() {
      this.$router.push('open/json');
    },
    save() {
      this.$router.push('save/sav');
    },
    saveJson() {
      this.$router.push('save/json');
    },
    openGithub() {
      window.open('https://github.com/ficsit-felix/ficsit-felix', '_blank');
    },
    showAboutDialog() {
      EventBus.$emit(DIALOG_ABOUT);
    },
    showSettingsDialog() {
      EventBus.$emit(DIALOG_SETTINGS);
    },
    showHelpDialog() {
      EventBus.$emit(DIALOG_HELP);
    },
    showLicensesDialog() {
      EventBus.$emit(DIALOG_OPEN_SOURCE);
    },

    showOpenDialog() {
      EventBus.$emit(DIALOG_OPEN_WEB);
    },
    showSaveDialog() {
      EventBus.$emit(DIALOG_SAVE_WEB);
    },
    showOpenJsonDialog() {
      EventBus.$emit(DIALOG_OPEN_JSON_WEB);
    },
    showSaveJsonDialog() {
      EventBus.$emit(DIALOG_SAVE_JSON_WEB);
    },

    undo() {
      this.undoLastAction();
    },
    redo() {
      this.redoLastAction();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
.menubar {
  display: flex;
  background: $surface;
  flex-shrink: 0;
  padding-left: 30px;
  padding-right: 30px;
  user-select: none;
  align-items: center;
  .logoContainer {
    margin-right: 60px;
  }

  .spacer {
    flex-grow: 1;
  }
  span.menu-item {
    display: inline-block;
    padding: 10px 10px;
    padding-right: 20px;
    font-size: 16px;
    line-height: 33px;
    i {
      padding-right: 5px;
    }
    color: #e3d3d3;
    transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
  }
  span:hover {
    color: $primaryOrange;
    cursor: pointer;
    .v-icon {
      color: $primaryOrange;
    }
  }
}
p,
b {
  padding: 0px 16px;
}
</style>
