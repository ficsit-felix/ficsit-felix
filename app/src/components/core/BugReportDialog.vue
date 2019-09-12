<template>
  <div class="bugreport">
    <md-dialog :md-active.sync="showBugReportDialog">
      <md-dialog-title>{{ $t('dialog.bugReport.title') }}</md-dialog-title>
      <md-dialog-content>
        <div class="dialog-content">
          <p v-if="message" class="errorMessage">{{ message }}</p>
          <md-field>
            <label>{{ $t('dialog.bugReport.userMessage') }}</label>
            <md-textarea
              v-model="userMessage"
              :disabled="formDisabled"
            ></md-textarea>
          </md-field>

          <md-field>
            <label>{{ $t('dialog.bugReport.userContact') }}</label>
            <md-input v-model="userContact" :disabled="formDisabled"></md-input>
          </md-field>

          <md-checkbox v-model="includeSave" :disabled="formDisabled">{{
            $t('dialog.bugReport.includeSave')
          }}</md-checkbox>
          <div v-if="screenshotDataUrl !== ''">
            <md-checkbox v-model="includeScreenshot" :disabled="formDisabled">{{
              $t('dialog.bugReport.includeScreenshot')
            }}</md-checkbox>

            <img :src="screenshotDataUrl" v-if="includeScreenshot" />
          </div>

          <md-progress-spinner
            v-if="formDisabled"
            md-mode="indeterminate"
            class="floating"
          ></md-progress-spinner>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          @click="showBugReportDialog = false"
          :disabled="formDisabled"
          >{{ $t('general.close') }}</md-button
        >
        <md-button
          class="md-primary"
          @click="sendReport()"
          :disabled="formDisabled"
          >{{ $t('dialog.bugReport.send') }}</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-alert
      :md-active.sync="showSentDialog"
      :md-content="$t('dialog.bugReport.sentMessage')"
      :md-confirm-text="$t('general.ok')"
    />
    <md-dialog-alert
      :md-active.sync="showErrorDialog"
      :md-content="$t('dialog.bugReport.errorMessage')"
      :md-confirm-text="$t('general.ok')"
    />
  </div>
</template>

<script lang="ts">
import 'whatwg-fetch';
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({})
export default class BugReportDialog extends Vue {
  @Prop({ default: '' }) readonly uuid!: string;
  @Prop({ default: '' }) readonly filename!: string;
  @Prop({ default: true }) readonly defaultIncludeSave!: boolean;

  message: string = '';
  showBugReportDialog = false;
  showSentDialog: boolean = false;
  showErrorDialog: boolean = false;

  userContact: string = '';
  userMessage: string = '';
  includeSave: boolean = true;
  includeScreenshot: boolean = true;
  screenshotDataUrl: string = '';

  formDisabled: boolean = false;

  openReportWindow(message: string) {
    this.message = message;
    this.showBugReportDialog = true;
    this.includeSave = this.defaultIncludeSave;

    const scene = document.getElementById('scene');
    if (scene !== undefined && scene !== null) {
      const canvas = scene.getElementsByTagName('canvas')[0];
      if (canvas !== undefined && canvas !== null) {
        this.screenshotDataUrl = canvas.toDataURL('image/jpeg');
        this.includeScreenshot = true;
      }
    } else {
      this.screenshotDataUrl = '';
      this.includeScreenshot = false;
    }
  }

  sendReport() {
    this.formDisabled = true;

    let zip = new JSZip();
    if (this.includeSave) {
      if (window.data instanceof ArrayBuffer) {
        zip.file(this.filename + '.sav', window.data, { binary: true });
      } else {
        zip.file(this.filename + '.json', JSON.stringify(window.data));
      }
    }

    if (this.includeScreenshot) {
      const screenshot = Buffer.from(
        this.screenshotDataUrl.substring(
          this.screenshotDataUrl.indexOf(',') + 1
        ),
        'base64'
      );

      zip.file('screenshot.jpg', screenshot, { binary: true });
    }

    const meta = `message: ${this.message}
userContact: ${this.userContact}
userMessage: ${this.userMessage}
filename: ${this.filename}
uuid: ${this.uuid}
`;
    zip.file('meta.txt', meta);

    zip
      .generateAsync(
        {
          type: 'uint8array',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        } /*,
        (metadata: any) => {
          console.log(metadata.percent);
        }*/
      )
      .then((content: Uint8Array) => {
        window
          .fetch(
            'https://owl.yt/ficsit-felix/?uuid=' +
              this.uuid +
              '&message=' +
              Buffer.from(this.message).toString('base64'),
            {
              method: 'POST',
              body: content, //Buffer.from(content, 'base64').toString('ascii'),
              headers: {
                'Content-Type': 'application/octet-stream'
              }
            }
          )
          .then(response => {
            if (!response.ok) {
              return Promise.reject('http ' + response.status);
            }
            return response.json();
          })
          .then(response => {
            this.showBugReportDialog = false;
            this.formDisabled = false;
            this.showSentDialog = true;
            // prepare for possible next report
            this.userMessage = '';
            this.includeSave = true;
          })
          .catch((error: Error) => {
            this.showBugReportDialog = false;
            this.formDisabled = false;
            console.error(error);
            this.showErrorDialog = true;
          });
      })
      .catch((error: Error) => {
        this.showBugReportDialog = false;
        this.formDisabled = false;
        console.error(error);
        this.showErrorDialog = true;
      });
  }
}
</script>

<style lang="scss" scoped>
.bugreport {
  /* As we need to place the md-dialog outside of this component, so that clicking on the background can work */
  display: flex;
  flex-direction: column;
}
.errorMessage {
  overflow: auto;
}
.dialog-content {
  width: 500px;
  @media (max-width: 700px) {
    width: 100%;
  }
}

.floating {
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -30px;
}
</style>
<style lang="css" scoped>
.dialog-content >>> .md-checkbox {
  display: flex !important;
  margin: 10px 10px 10px 0px !important;
}
.dialog-content img {
  max-width: 100%;
  max-height: 300px;
  display: flex;
}
</style>
