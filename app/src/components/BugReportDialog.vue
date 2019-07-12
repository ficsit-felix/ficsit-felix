<template>
  <div class="bugreport">
    <md-dialog :md-active.sync="visible">
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
        <md-button @click="$emit('dismiss')" :disabled="formDisabled">{{
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
  @Prop(Boolean) readonly visible: boolean;
  @Prop(String) readonly message: string;
  @Prop(String) readonly uuid: string;
  @Prop(String) readonly filename: string;

  showSentDialog: boolean = false;
  showErrorDialog: boolean = false;

  userContact: string = '';
  userMessage: string = '';
  includeSave: boolean = true;

  formDisabled: boolean = false;

  sendReport() {
    this.formDisabled = true;

    let zip = new JSZip();
    if (this.includeSave) {
      zip.file(this.filename, window.data, { binary: true });
    }

    const meta = `message: ${this.message}
userContact: ${this.userContact}
userMessage: ${this.userMessage}
`;
    zip.file('meta.txt', meta);

    zip
      .generateAsync({
        type: 'base64',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      })
      .then(content => {
        window
          .fetch(
            'http://localhost:5000/ficsit-felix/us-central1/reportBug?uuid=' +
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
            this.$emit('dismiss');
            this.formDisabled = false;
            this.showSentDialog = true;
          })
          .catch(error => {
            this.$emit('dismiss');
            this.formDisabled = false;
            console.error(error);
            this.showErrorDialog = true;
          });
      })
      .catch(error => {
        this.$emit('dismiss');
        this.formDisabled = false;
        console.error(error);
        this.showErrorDialog = true;
      });
  }
}
</script>

<style lang="scss" scoped>
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
