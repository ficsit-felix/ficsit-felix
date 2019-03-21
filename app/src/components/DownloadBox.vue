<template>
  <div>
    <div v-if="!isSaving" class="infobox">
      <p v-if="errorText == ''">File should be downloaded.</p>
      <p v-else>An error occured.</p>
      <br />
      <br />
      <md-button class="md-raised" @click="$router.push('/')"
        >Back to editor</md-button
      >
    </div>
    <div v-else class="infobox">
      <p>Downloading save file...</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="secondary">{{ infoText }}</p>
    </div>

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>Error</md-dialog-title>
      <span class="dialog-content">{{ errorText }}</span>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false"
          >Close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -20px;
  color: $textGray;
  padding: 10px 10px;
  height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  border-radius: 10px;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 700px;
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
  padding: 50px 0;
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

.secondary {
  font-size: 15px;
  margin-top: 10px;
  color: $logoColorLight;
}

.dialog-content {
  padding: 0px 20px;
}
</style>

<script>
import * as axios from "axios";
import { mapActions, mapState } from "vuex";
import { setTimeout } from "timers";
import * as Sentry from "@sentry/browser";

import { Json2Sav } from "@/transformation/index";

export default {
  name: "DownloadBox",
  data: function() {
    return {
      isSaving: true,
      progress: 0,
      infoText: "initializing...",
      showErrorDialog: false,
      errorText: ""
    };
  },
  watch: {
    isSaving: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$emit("startAnimating");
        } else {
          this.$emit("stopAnimating");
        }
      }
    }
  },
  computed: {
    ...mapState(["dataLoaded", "filename"])
  },
  created() {
    if (!this.dataLoaded) {
      // The user needs to upload a file first
      this.$router.push("upload");
    }
  },
  mounted() {
    this.uploadFile();
  },
  methods: {
    handleError(errorMessage) {
      this.showErrorDialog = true;
      this.errorText = errorMessage;
      this.isSaving = false;
      this.progress = 0;
    },
    uploadFile() {
      this.isSaving = true;
      this.infoText = "reading file...";

      var data = new Json2Sav(window.data).transform();
      this.isSaving = false;
      var element = document.createElement("a");

      var blob = new Blob([Buffer.from(data, "binary")], {
        type: "application/octet-stream"
      });
      element.href = window.URL.createObjectURL(blob);
      element.download = this.filename;

      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);



      /*
      const uri =
        process.env.NODE_ENV === "production"
          ? "https://us-central1-ficsit-felix.cloudfunctions.net/json2sav"
          : "http://localhost:5000/ficsit-felix/us-central1/json2sav";
      // console.log("start download");

      var data = JSON.stringify(window.data);
      var config = {
        onUploadProgress: e => {
          //console.log("upload", e);
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            // console.log(percentage);
            if (percentage == 100) {
              this.infoText = "processing file...";
            }
            this.progress = percentage / 2;
          } else {
            this.progress += 1;
          }
        },
        onDownloadProgress: e => {
          //console.log("download", e);
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            //console.log(percentage);
            this.progress = percentage / 2 + 50;
          } else {
            this.progress += 1;
          }
        },
        headers: {
          "Content-Type": "application/octet-stream"
        }
      };
      axios
        .post(uri, data, config)
        .then(response => {
          // console.log(response);
          this.progress = 100;
          if (response.data.type === "error") {
            Sentry.captureMessage(response.data.text);
            this.handleError(response.data.text);
          } else {
            this.infoText = "opening downloaded file...";
            setTimeout(() => {
              this.isSaving = false;
              //console.log(typeof response.data);

              // start download
              // saveAs(response.data, this.filename);


              // TODO
              // console.log(response.data);
            }, 100);
          }
        })
        .catch(error => {
          Sentry.captureException(error);
          this.handleError(error.message);
          console.error(error);
        });*/
    }
  }
};
</script>
