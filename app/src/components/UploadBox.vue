<template>
  <div>
    <form enctype="multipart/form-data" novalidate v-if="!isSaving">
      <div class="dropbox">
        <input
          type="file"
          name="uploadField"
          accept=".sav"
          class="input-file"
          @change="uploadFile($event.target.files[0])"
        />
        <!--
            
        @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"-->
        <p>Drag your save file here to begin <br />or click to browse</p>
      </div>
    </form>
    <div v-else class="infobox">
      <p>Uploading save file...</p>
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
import { mapActions } from "vuex";
import * as Sentry from "@sentry/browser";
export default {
  data: function() {
    return {
      isSaving: false,
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
  mounted() {},
  methods: {
    ...mapActions(["setLoadedData", "setFilename", "setUUID"]),
    handleError(errorMessage) {
      this.showErrorDialog = true;
      this.errorText = errorMessage;
      this.isSaving = false;
      this.progress = 0;
    },
    uploadFile(file) {
      this.isSaving = true;
      this.infoText = "reading file...";
      console.log("Uploading...", file);
      this.setFilename(file.name);
      Sentry.configureScope(scope => {
        scope.setExtra("filename", file.name);
      });

      const uri =
        process.env.NODE_ENV === "production"
          ? "https://us-central1-ficsit-felix.cloudfunctions.net/sav2json"
          : "http://localhost:5000/ficsit-felix/us-central1/sav2json";

      var data = file;
      var config = {
        onUploadProgress: e => {
          //console.log('upload', e);
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            // console.log(percentage);
            if (percentage == 100) {
              this.infoText = "processing file...";
            }
            this.progress = percentage / 3;
          } else {
            this.progress += 1;
          }
        },
        onDownloadProgress: e => {
          //console.log('download', e);
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            //console.log(percentage);
            this.progress = percentage / 3 + 33;
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

          if (response.data.type === "error") {
            Sentry.captureMessage(response.data.text);
            this.handleError(response.data.text);
          } else {
            Sentry.configureScope(scope => {
              scope.setExtra("uuid", response.data.uuid);
              scope.setExtra("filename", file.name);
            });
            this.setUUID(response.data.uuid);
            // console.log(response.data.uuid);
            this.infoText = "building world...";
            // give us some time to build the 3d world while animating the progress bar
            this.setLoadedData(response.data).then(() => {
              this.buildInterval = setInterval(() => {
                this.progress += 1;
                if (this.progress >= 100) {
                  this.progress = 100;
                  clearInterval(this.buildInterval);
                  setTimeout(() => {
                    // let the user at least see the full bar
                    this.$router.push("/");
                  }, 100);
                }
              }, 30);
            });
          }
        })
        .catch(error => {
          Sentry.captureException(error);
          this.handleError(error.message);
          console.error(error);
        });
      /*    const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      
      const self = this;
      this.xhr.upload.addEventListener("progress", (e) => {
              if (e.lengthComputable) {
              const percentage = Math.round((e.loaded * 100) / e.total);
              console.log(percentage);
              this.progress = percentage / 2;
              }
          }, false);
      
      xhr.upload.addEventListener("load", (e) => {

          console.log('finished');
          }, false);
      xhr.open("POST", uri);
      xhr.overrideMimeType('application/octet-stream');
      xhr.onreadystatechange = function() {
        console.log(xhr);
          if (xhr.readyState == 4 && xhr.status == 200) {
              alert(xhr.responseText); // handle response.
          }
      };
      xhr.send(file);*/
    }
  }
};
</script>
