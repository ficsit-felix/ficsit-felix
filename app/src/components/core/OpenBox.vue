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
        <!--
            
        @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"-->
        <p v-if="importJson" class="dragInstruction">
          {{ $t('openPage.dragJson') }}
        </p>
        <p v-else class="dragInstruction">
          {{ $t('openPage.dragSav') }}
        </p>
      </div>
    </form>
    <div v-else class="infobox">
      <p v-if="importJson">{{ $t('openPage.subtitleJson') }}</p>
      <p v-else>{{ $t('openPage.subtitleSav') }}</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="secondary">{{ infoText }}</p>
    </div>

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>{{ $t('openPage.errorTitle') }}</md-dialog-title>
      <span class="dialog-content"
        >{{ errorText
        }}<span v-if="showSendSave"
          ><br /><br />
          <i18n path="openPage.errorText">
            <a
              href="https://www.dropbox.com/request/Db1OgmSDra2EEVjPbcmj"
              place="dropbox"
              >{{ $t('openPage.dropboxText') }}</a
            >
            <a href="mailto:felix@owl.yt" place="mail">felix@owl.yt</a>
          </i18n>
        </span></span
      >
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false">{{
          $t('general.close')
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <BugReportDialog
      ref="bugReport"
      :filename="filename"
      :uuid="uuid"
    ></BugReportDialog>
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

import BugReportDialog from './BugReportDialog';

export default {
  components: {
    BugReportDialog
  },
  data: function() {
    return {
      isSaving: false,
      progress: 0,
      infoText: this.$t('openPage.initializing'),
      showErrorDialog: false,
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
      this.infoText = this.$t('openPage.readingFile');
      console.log('Opening...', file);
      console.log('name: ' + file.name);
      console.log('last modified: ' + file.lastModifiedDate);
      console.log('size: ' + file.size);
      this.setFilename(file.name);
      const uuid = v4();
      this.setUUID(uuid);

      reportContext('uuid', uuid);
      reportContext('savename', file.name);
      this.setLoading(false).then(() => {});

      const expected = this.importJson ? 'json' : 'sav';

      if (file.name.split('.').pop() !== expected) {
        const message = this.$t('openPage.extensionError', {
          expected: expected,
          actual: file.name.split('.').pop()
        });
        reportException(message);
        this.handleError(message, false);
        return;
      }

      var reader = new FileReader();
      reader.onprogress = evt => {
        if (evt.lengthComputable) {
          var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
          this.progress = percentLoaded / 2;
        }
      };
      reader.onload = response => {
        this.processFile(reader.result);
      };
      reader.readAsArrayBuffer(file);
    },

    processFile(data) {
      // put save file data on window object to make it accessible to the BugReportDialog without polluting Vue
      window.data = data;

      this.infoText = this.$t('openPage.processing');
      this.progress = 50;
      try {
        var json;
        if (this.importJson) {
          json = JSON.parse(Buffer.from(data).toString('utf-8'));
        } else {
          json = sav2json(Buffer.from(data));
        }

        // reportMessage("debugSav2Json");

        this.infoText = this.$t('openPage.buildingWorld');
        // give us some time to build the 3d world while animating the progress bar
        this.setLoadedData(json)
          .then(() => {
            this.buildInterval = setInterval(() => {
              this.progress += 1;
              if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(this.buildInterval);
                setTimeout(() => {
                  // let the user at least see the full bar
                  this.$router.push({
                    name: 'editor'
                  });
                }, 100);
              }
            }, 30);
          })
          .catch(error => {
            reportError(error);
            this.handleError(error.message);
          });
      } catch (error) {
        reportError(error);
        this.handleError(error.message);
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
p {
  color: $textGray;
}

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -20px;
  color: $textGray;
  padding: 10px 10px;
  height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  justify-items: center;
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
  background: #efeded;
}

.dropbox p {
  font-size: 17px;
  text-align: center;
}

.infobox {
  height: 200px;
  font-size: 17px;
  padding: 20px 40px;
  color: $textGray;
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

.secondary {
  font-size: 15px;
  margin-top: 10px;
  color: $logoColorLight;
}

.dialog-content {
  padding: 0px 20px;
}
</style>
