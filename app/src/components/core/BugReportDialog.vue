<template>
  <div class="bugreport">
    <v-dialog v-model="showBugReportDialog" width="700" scrollable>
      <v-card>
        <v-card-title>{{ $t('dialog.bugReport.title') }}</v-card-title>
        <v-card-text>
          <p v-if="message" class="errorMessage">{{ message }}</p>

          <v-textarea
            :label="$t('dialog.bugReport.userMessage')"
            v-model="userMessage"
            :disabled="formDisabled"
            outlined
            class="mt-2"
            hide-details
          ></v-textarea>

          <v-text-field
            :label="$t('dialog.bugReport.userContact')"
            v-model="userContact"
            :disabled="formDisabled"
            outlined
            hide-details
            class="mt-4"
          ></v-text-field>

          <v-checkbox
            v-model="includeSave"
            :disabled="formDisabled"
            :label="$t('dialog.bugReport.includeSave')"
            hide-details
          ></v-checkbox>
          <div v-if="screenshotDataUrl !== ''">
            <v-checkbox
              v-model="includeScreenshot"
              :disabled="formDisabled"
              :label="$t('dialog.bugReport.includeScreenshot')"
              hide-details
            ></v-checkbox>

            <img :src="screenshotDataUrl" v-if="includeScreenshot" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="showBugReportDialog = false"
            :disabled="formDisabled"
          >
            {{ $t('general.close') }}
          </v-btn>
          <v-progress-circular
            v-if="formDisabled"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn
            color="primary"
            text
            @click="sendReport()"
            :disabled="formDisabled"
          >
            {{ $t('dialog.bugReport.send') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AlertDialog
      v-model="showSentDialog"
      :content="$t('dialog.bugReport.sentMessage')"
    ></AlertDialog>
    <AlertDialog
      v-model="showErrorDialog"
      :content="$t('dialog.bugReport.errorMessage')"
    ></AlertDialog>
  </div>
</template>

<script lang="ts">
import 'whatwg-fetch';
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AlertDialog from './AlertDialog.vue';

@Component({ components: { AlertDialog } })
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

  fetchFileForBugReport(file: File): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = response => {
        if (response === null || response.target === null) {
          reject();
          return;
        }
        resolve(response.target.result as Buffer);
      };
      reader.readAsArrayBuffer(file);
      // TODO error handling?
    });
  }

  readFileForBugReport(file: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const fs = require('fs');
      fs.readFile(file, (err: Error, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  sendReport() {
    this.formDisabled = true;

    let zip = new JSZip();
    if (this.includeSave) {
      if (window.data instanceof File) {
        // The file has not been read completely, we need to reread it ourselves (browser)
        zip.file(window.data.name, this.fetchFileForBugReport(window.data));
      } else if (typeof window.data === 'string') {
        // The file has not been read completely, we need to reread it ourselves (desktop)
        zip.file(
          window.data.replace(/^.*[\\/]/, ''),
          this.readFileForBugReport(window.data)
        );
      } else if (window.data instanceof ArrayBuffer) {
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
version: ${process.env.PACKAGE_VERSION}
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
.dialog-content img {
  max-width: 100%;
  max-height: 300px;
  display: flex;
}
</style>
