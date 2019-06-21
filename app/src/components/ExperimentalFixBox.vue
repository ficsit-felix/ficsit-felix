<template>
  <div>
    <form enctype="multipart/form-data" novalidate v-if="!isSaving">
      <div class="dropbox">
        <input
          type="file"
          name="openField"
          accept=".sav"
          class="input-file"
          @change="openFile($event.target.files[0])"
        />
        <!--
            
        @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"-->
        <p class="dragInstruction">{{ $t("openPage.dragSav") }}</p>
      </div>
    </form>
    <div v-else class="infobox">
      
      <p>{{ $t("openPage.subtitleSav") }}</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="secondary">{{ infoText }}</p>
    </div>

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>{{ $t("openPage.errorTitle") }}</md-dialog-title>
      <span class="dialog-content"
        >{{ errorText }} <br /><br />
        <i18n path="openPage.errorText">
          <a
            href="https://www.dropbox.com/request/Db1OgmSDra2EEVjPbcmj"
            place="dropbox"
            >{{ $t("openPage.dropboxText") }}</a
          >
          <a href="mailto:felix@owl.yt" place="mail">felix@owl.yt</a>
        </i18n>
      </span>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showErrorDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import * as Sentry from "@sentry/browser";
import { v4 } from "uuid";

import { Sav2Json, Json2Sav } from "satisfactory-json";
import { modelHelper } from "@/helpers/modelHelper";
import { modelConfig } from "@/definitions/models";

export default {
  name: 'ExperimentalFixBox',
  data: function() {
    return {
      isSaving: false,
      progress: 0,
      infoText: this.$t("openPage.initializing"),
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
    ...mapState(["filename"])
  },
  mounted() {
    Sentry.captureMessage("visit fix page");


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
      this.infoText = this.$t("openPage.readingFile");
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
      this.setLoading(false).then(() => {});
      var reader = new FileReader();
      reader.onload = response => {
        this.processFile(response.target.result);
      };
      reader.readAsArrayBuffer(file);
    },

    processFile(data) {
      this.infoText = this.$t("openPage.processing");
      this.progress = 50;
      try {
        var json;
          let sav2Json = new Sav2Json(Buffer.from(data));
          json = sav2Json.transform();

        this.infoText = this.$t("experimentalFix.fixing");

        data = new Json2Sav(json).transform();

        //// SAVING
        var element = document.createElement("a");

        var blob = new Blob([Buffer.from(data, "binary")], {
          type: "application/octet-stream"
        });

        this.progress = 50;
        this.buildInterval = setInterval(() => {
          this.progress += 1;
          if (this.progress >= 100) {
            this.progress = 100;
            clearInterval(this.buildInterval);
            setTimeout(() => {
              Sentry.captureMessage("saved file");

              element.href = window.URL.createObjectURL(blob);
              element.download =
                this.filename.replace(".json", "").replace(".sav", "") +
                ".sav";

              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
              this.isSaving = false;
            }, 100);
          }
        }, 30);
        
      } catch (error) {
        Sentry.captureException(error);
        this.handleError(error.message);
        console.error(error);
      }
    }
  }
};
</script>

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
  display: flex;
  justify-items: center;
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
.dragInstruction {
  width: 300px;
  margin: auto;
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
