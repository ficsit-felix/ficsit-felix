<template>
  <div>
    <p v-if="!importJson">
      {{
        $t('openPage.saveLocation', {
          saveLocation: '%localappdata%\\FactoryGame\\Saved\\SaveGames'
        })
      }}
    </p>
    <form enctype="multipart/form-data" novalidate v-if="!isSaving">
      <div class="dropbox">
        <input
          v-if="importJson"
          type="file"
          name="openField"
          accept=".json"
          class="input-file"
          @change="openFile($event.target.files[0])"
        />
        <input
          v-else
          type="file"
          name="openField"
          accept=".sav"
          class="input-file"
          @change="openFile($event.target.files[0])"
        />
        <p v-if="importJson" class="dragInstruction">
          {{ $t('openPage.dragJson') }}
        </p>
        <p v-else class="dragInstruction">{{ $t('openPage.dragSav') }}</p>
      </div>
    </form>
    <div v-else class="infobox">
      <p v-if="importJson">{{ $t('openPage.subtitleJson') }}</p>
      <p v-else>{{ $t('openPage.subtitleSav') }}</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="info-text">{{ infoText }}</p>
    </div>

    <!-- TODO

    <BugReportDialog
      ref="bugReport"
      :filename="filename"
      :uuid="uuid"
    ></BugReportDialog>
    -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as Sentry from '@sentry/browser';
import { v4 } from 'uuid';

import { modelHelper } from '@/helpers/modelHelper';
import { modelConfig } from '@/definitions/models';

import { reportMessage, reportContext, reportError } from '@/ts/errorReporting';
import { reportException } from '@/ts/errorReporting';
import { sav2json } from 'satisfactory-json';
import FileReaderStream from 'filereader-stream';

import BugReportDialog from './BugReportDialog';

import * as Sav2JsonWorker from 'worker-loader?name=[name].js!@/transformation/sav2json.worker.js';
import { SaveGameLoading } from './SaveGameLoading';
import { WebFileReader } from '../web/WebFileReader';

export default {
  components: {
    //BugReportDialog
  },
  data: function() {
    return {
      isSaving: false,
      progress: 0,
      infoText: this.$t('openPage.initializing'),
      errorText: '',
      showSendSave: false,
      importJson: false
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
  computed: {
    ...mapState(['filename', 'uuid'])
  },
  mounted() {
    this.importJson = this.$route.path === '/open/json';

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

    for (var a in modelConfig) {
      if (modelConfig[a].model !== '') {
        modelHelper.loadModel('/models/' + modelConfig[a].model);
      }
    }
  },
  methods: {
    ...mapActions(['setLoadedData', 'setFilename', 'setUUID', 'setLoading']),

    handleError(errorMessage, showBugReportWindow = true) {
      if (showBugReportWindow) {
        this.$refs.bugReport.openReportWindow(
          this.$t('savePage.error') + ' ' + errorMessage
        );
      } else {
        this.errorText = errorMessage;
        this.showErrorDialog = true;
        this.showSendSave = false;
      }
      this.isSaving = false;
      this.progress = 0;
    },
    openFile(file) {
      this.isSaving = true;
      new SaveGameLoading(
        this,
        new WebFileReader(new Sav2JsonWorker(), file)
      ).loadSaveGame(file.name, file.path, this.importJson);

      /*// TODO  how does the BugReportDialog handle this now?
      // put save file data on window object to make it accessible to the BugReportDialog without polluting Vue
      window.data = file;*/

      /*
      // TODO handle auto load
            if (this.$store.state.settings.autoLoadSaveFile !== '') {
        this.$router.push({
          path: 'open/auto'
        });
      }
      */
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
/*p {
  color: $textGray;
}*/

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
  background: rgba(255, 255, 255, 0.1);
}

.dropbox p {
  font-size: 17px;
  text-align: center;
}

.infobox {
  height: 200px;
  font-size: 17px;
  padding: 20px 40px;
  /*color: $textGray;*/
}
.progressbar {
  border: 2px solid $middleGray;
  height: 50px;
  border-radius: 5px;
  padding: 3px;
  .content {
    background: $middleGray;
    height: 100%;
    border-radius: 3px;
  }
}
.dragInstruction {
  margin: auto;
  padding: 0px 30px;
}

.info-text {
  font-size: 15px;
  margin-top: 10px;
  /*color: $logoColorLight;*/
}

.dialog-content {
  padding: 0px 20px;
}
</style>
