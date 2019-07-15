<template>
  <div class="bugreport">
        <md-dialog :md-active.sync="showBugReportDialog">

    <md-dialog-title>{{ $t('dialog.bugReport.title') }}</md-dialog-title>
    <md-dialog-content>
      <div class="dialog-content">
        <p v-if="message">{{ message }}</p>
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
        <md-checkbox
          v-model="includeSave"
          :disabled="formDisabled"
          style="margin: 0px"
          >{{ $t('dialog.bugReport.includeSave') }}</md-checkbox
        >

        <md-progress-spinner
          v-if="formDisabled"
          md-mode="indeterminate"
          class="floating"
        ></md-progress-spinner>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button @click="showBugReportDialog = false" :disabled="formDisabled">{{
        $t('general.close')
      }}</md-button>
      <md-button
        class="md-primary"
        @click="sendReport()"
        :disabled="formDisabled"
      >
        {{ $t('dialog.bugReport.send') }}
      </md-button>
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
  @Prop(String) readonly uuid: string;
  @Prop(String) readonly filename: string;

message: string ='';
  showBugReportDialog = false;
showSentDialog: boolean = false;
  showErrorDialog: boolean = false;

  userContact: string = '';
  userMessage: string = '';
  includeSave: boolean = true;

  formDisabled: boolean = false;

  openReportWindow(message: string) {
    this.message = message;
    this.showBugReportDialog = true;
    console.log('OH');
  }

  sendReport() {
    this.formDisabled = true;

    let zip = new JSZip();
    if (this.includeSave) {
      console.log(typeof window.data);
      if (window.data instanceof ArrayBuffer) {
        zip.file(this.filename + '.sav', window.data, { binary: true });
      } else {
        zip.file(this.filename + '.json', JSON.stringify(window.data));

      }
    }

    const meta = `message: ${this.message}
userContact: ${this.userContact}
userMessage: ${this.userMessage}
`;
    zip.file('meta.txt', meta);

    zip
      .generateAsync({
        type: 'uint8array',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      })
      .then(content => {
        window
          .fetch(
            'https://owl.yt/ficsit-felix/?uuid=' +
              this.uuid,
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
            console.log(response);
            this.showBugReportDialog = false;
            this.formDisabled = false;
            this.showSentDialog = true;
            // prepare for possible next report
            this.userMessage = '';
            this.includeSave = true;
          })
          .catch(error => {
            this.showBugReportDialog = false;
            this.formDisabled = false;
            console.error(error);
            this.showErrorDialog = true;
          });
      })
      .catch(error => {
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
