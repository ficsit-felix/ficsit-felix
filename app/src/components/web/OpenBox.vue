<template>
  <div>
    <p
      v-if="!importJson"
      @click="copySaveLocationToClipboard"
      class="saveLocation"
    >
      {{
        $t('openPage.saveLocation', {
          saveLocation: '%localappdata%\\FactoryGame\\Saved\\SaveGames'
        })
      }}
    </p>
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox" v-ripple>
        <input
          v-if="importJson"
          type="file"
          name="openField"
          accept=".json"
          class="input-file"
          @change="openFile($event.target)"
        />
        <input
          v-else
          type="file"
          name="openField"
          accept=".sav"
          class="input-file"
          @change="openFile($event.target)"
        />
        <p v-if="importJson" class="dragInstruction">
          {{ $t('openPage.dragJson') }}
        </p>
        <p v-else class="dragInstruction">{{ $t('openPage.dragSav') }}</p>
      </div>
    </form>

    <AlertDialog
      v-model="showErrorDialog"
      :title="$t('openPage.errorTitle')"
      :content="errorText"
    ></AlertDialog>

    <v-snackbar v-model="showLocationClipboardSnack" :timeout="1000">{{
      $t('openPage.copiedToClipboard')
    }}</v-snackbar>
  </div>
</template>

<script>
import { modelHelper } from '@lib/graphics/modelHelper';
import { modelConfig } from '@lib/definitions/models';

import { SaveGameLoading } from '@/lib/core/SaveGameLoading';
import { WebFileReader } from '@/lib/web/WebFileReader';
import copyToClipboard from '@lib/copyToClipboard';

import AlertDialog from '../core/dialogs/AlertDialog.vue';

export default {
  components: { AlertDialog },
  data: function() {
    return {
      isSaving: false,
      importJson: false,
      showLocationClipboardSnack: false,
      showErrorDialog: false,
      errorText: ''
    };
  },
  watch: {
    isSaving: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$emit('startAnimating');
        } else {
          this.$emit('stopAnimating');
        }
      }
    }
  },
  mounted() {
    this.importJson = this.$route.path === '/open/json';

    /* // TODO read auto load save file
    if (
      this.$route.path == '/open/auto' &&
      this.$store.state.settings.autoLoadSaveFile !== ''
    ) {
      this.importJson = true; // TODO depend on file extension
      this.isSaving = true;
      // fetch auto load  save file
      fetch(this.$store.state.settings.autoLoadSaveFile)
        .then(file => {
          file.arrayBuffer().then(data => {
            this.processFile(data);
          });
        })
        .catch(error => this.handleError(error.message));
    }
    */

    for (let config in modelConfig) {
      if (modelConfig[config].model !== '') {
        modelHelper.loadModel('/models/' + modelConfig[config].model);
      }
    }
  },
  methods: {
    openFile(input) {
      const file = input.files[0];
      if (file === undefined) {
        return;
      }
      // reset input so that the same file can be selected again in case of an error
      input.value = '';

      const expected = this.importJson ? 'json' : 'sav';

      if (file.name.split('.').pop() !== expected) {
        const message = this.$t('openPage.extensionError', {
          expected: expected,
          actual: file.name.split('.').pop()
        });
        this.showErrorDialog = true;
        this.errorText = message;
        return;
      }

      // this.isSaving = true;
      new SaveGameLoading(this, new WebFileReader(file)).loadSaveGame(
        file.name,
        file.path,
        this.importJson
      );

      /*
      // TODO handle auto load
            if (this.$store.state.settings.autoLoadSaveFile !== '') {
        this.$router.push({
          path: 'open/auto'
        });
      }
      */
    },
    copySaveLocationToClipboard() {
      copyToClipboard('%localappdata%\\FactoryGame\\Saved\\SaveGames');
      this.showLocationClipboardSnack = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -20px;
  /*color: $textGray;*/
  padding: 10px 10px;
  height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  justify-items: center;
  margin: 16px;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 700px;
  @media (max-width: 700px) {
    width: 100%;
  }
  height: 200px;
  position: absolute;
  cursor: pointer;
  left: 0px;
}

.dropbox:hover {
  //background: rgba(255, 255, 255, 0.1);
  outline-color: #ccc;
  color: #bbb;
}

.dropbox p {
  font-size: 17px;
  text-align: center;
}

.dragInstruction {
  margin: auto;
  padding: 0px 30px;
}

.saveLocation {
  cursor: pointer;
}
</style>
