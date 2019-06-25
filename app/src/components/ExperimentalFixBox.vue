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

    <md-checkbox
      :model="saveAsZip"
      @change="setSaveAsZip"
      class="lightCheckbox md-primary"
      >{{ $t("experimentalFix.saveAsZip") }}</md-checkbox
    >

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>{{ $t("openPage.errorTitle") }}</md-dialog-title>
      <span class="dialog-content">
        {{ errorText }}
        <span v-if="showSendSave">
          <br />
          <br />
          <i18n path="openPage.errorText">
            <a
              href="https://www.dropbox.com/request/Db1OgmSDra2EEVjPbcmj"
              place="dropbox"
              >{{ $t("openPage.dropboxText") }}</a
            >
            <a href="mailto:felix@owl.yt" place="mail">felix@owl.yt</a>
          </i18n>
        </span>
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

import { findActorByName } from "@/helpers/entityHelper";
import { reportMessage, reportContext, reportError } from "@/ts/errorReporting";

import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import { reportException } from "../ts/errorReporting";
import { refreshActorComponentDictionary } from "../helpers/entityHelper";

export default {
  name: "ExperimentalFixBox",
  data: function() {
    return {
      isSaving: false,
      progress: 0,
      infoText: this.$t("openPage.initializing"),
      showErrorDialog: false,
      errorText: "",
      showSendSave: false
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
    ...mapState(["filename"]),
    ...mapState("settings", ["saveAsZip"])
  },
  mounted() {
    reportMessage("visit fix page");
  },
  methods: {
    ...mapActions(["setLoadedData", "setFilename", "setUUID", "setLoading"]),
    ...mapActions("settings", ["setSaveAsZip"]),

    handleError(errorMessage, showSendSave = true) {
      this.showErrorDialog = true;
      this.errorText = errorMessage;
      this.isSaving = false;
      this.progress = 0;
      this.showSendSave = showSendSave;
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

      reportContext("filename", file.name);
      reportContext("uuid", uuid);

      reportMessage("opened file");
      this.setLoading(false).then(() => {});

      if (file.name.split(".").pop() !== "sav") {
        const message = this.$t("openPage.extensionError", {
          expected: "sav",
          actual: file.name.split(".").pop()
        });
        reportException(message);
        this.handleError(message, false);
        return;
      }

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

        // reportMessage("debugSav2Json");

        this.infoText = this.$t("experimentalFix.fixing");

        for (const actor of json.actors) {
          if (
            actor.pathName ===
            "Persistent_Level:PersistentLevel.RailroadSubsystem"
          ) {
            if (actor !== undefined) {
              if (actor.entity.extra === undefined) {
                // reset to old save header version
                json.saveHeaderType = 5;
              }
            }
          }
        }

        data = new Json2Sav(json).transform();

        this.progress = 50;
        this.buildInterval = setInterval(() => {
          this.progress += 1;
          if (this.progress >= 100) {
            this.progress = 100;
            clearInterval(this.buildInterval);
            setTimeout(() => {
              reportMessage("saved file");

              if (this.saveAsZip) {
                let zip = new JSZip();

                zip.file(
                  this.filename.replace(".json", "").replace(".sav", "") +
                    ".sav",
                  data,
                  { binary: true }
                );

                zip
                  .generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                      level: 9
                    }
                  })
                  .then(content => {
                    // see FileSaver.js
                    saveAs(
                      content,
                      this.filename.replace(".json", "").replace(".sav", "") +
                        ".zip"
                    );
                  })
                  .catch(error => {
                    reportError(error);
                    this.handleError(error.message);
                  });
              } else {
                var element = document.createElement("a");

                var blob = new Blob([Buffer.from(data, "binary")], {
                  type: "application/octet-stream"
                });

                element.href = window.URL.createObjectURL(blob);
                element.download =
                  this.filename.replace(".json", "").replace(".sav", "") +
                  ".sav";

                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
              }

              this.isSaving = false;
              this.progress = 0;
            }, 100);
          }
        }, 30);
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
<style>
.lightCheckbox {
  padding: 0px 16px;
  margin: 0px;
}
.lightCheckbox .md-checkbox-label {
  height: auto;
}
.lightCheckbox .md-checkbox-container {
  border-color: #ccc !important;
}
</style>
