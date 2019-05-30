<template>
  <div>
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
        <p v-if="importJson">
          Drag your JSON file here to begin <br />or click to browse
        </p>
        <p v-else>Drag your save file here to begin <br />or click to browse</p>
      </div>
    </form>
    <div v-else class="infobox">
      <p v-if="importJson">Importing JSON file...</p>
      <p v-else>Reading save file...</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="secondary">{{ infoText }}</p>
    </div>

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>Error</md-dialog-title>
      <span class="dialog-content"
        >{{ errorText }} <br /><br />
        Please send this save file to me <a href="https://www.dropbox.com/request/Db1OgmSDra2EEVjPbcmj">via this Dropbox form</a><br />or per Mail
        to <a href="mailto:felix@owl.yt">felix@owl.yt</a> so that I can fix this.
      </span>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false"
          >Close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
import { mapActions } from "vuex";
import * as Sentry from "@sentry/browser";
import { v4 } from "uuid";

import { Sav2Json } from "@/transformation/index";
import { modelHelper } from "@/helpers/modelHelper";
import { modelConfig } from "@/definitions/models";

export default {
  data: function() {
    return {
      isSaving: false,
      progress: 0,
      infoText: "initializing...",
      showErrorDialog: false,
      errorText: "",
      importJson: false
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
  mounted() {
    this.importJson = this.$route.path === "/open/json";

    Sentry.captureMessage("visit open page");

    for (var a in modelConfig) {
      if (modelConfig[a].model !== "") {
        modelHelper.loadModel("/models/" + modelConfig[a].model);
      }
    }
  },
  methods: {
    ...mapActions(["setLoadedData", "setFilename", "setUUID", "setLoading"]),

    handleError(errorMessage) {
      this.showErrorDialog = true;
      this.errorText = errorMessage;
      this.isSaving = false;
      this.progress = 0;
    },
    openFile(file) {
      this.isSaving = true;
      this.infoText = "reading file...";
      console.log("Opening...", file);
      console.log("name: " + file.name);
      console.log("last modified: " + file.lastModifiedDate);
      console.log("size: " + file.size);
      this.setFilename(file.name);
      const uuid = v4();
      this.setUUID(uuid);

      Sentry.configureScope(scope => {
        scope.setExtra("filename", file.name);
        scope.setExtra("uuid", uuid);
      });

      Sentry.captureMessage("opened file");
      this.setLoading(false).then(()=>{});
      var reader = new FileReader();
      reader.onload = response => {
        this.infoText = "processing file...";
        this.progress = 50;
        try {
          var json;
          if (this.importJson) {
            json = JSON.parse(
              Buffer.from(response.target.result).toString("utf-8")
            );
          } else {
            let sav2Json = new Sav2Json(Buffer.from(response.target.result));
            json = sav2Json.transform();

          }

          this.infoText = "building world...";
          // give us some time to build the 3d world while animating the progress bar
          this.setLoadedData(json).then(() => {
            this.buildInterval = setInterval(() => {
              this.progress += 1;
              if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(this.buildInterval);
                setTimeout(() => {
                  // let the user at least see the full bar
                  this.$router.push( {
                    name: "editor"
                  });
                }, 100);
              }
            }, 30);
          });
        } catch (error) {
          Sentry.captureException(error);
          this.handleError(error.message);
          console.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
};
</script>
