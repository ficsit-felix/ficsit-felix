<template>
  <div>
    <div v-if="!isSaving" class="infobox">
      <p v-if="errorText == ''">{{ $t("savePage.saveFinished") }}</p>
      <p v-else>{{ $t("savePage.error") }}</p>
      <br />
      <br />
      <md-button class="md-raised" @click="$router.push({ name: 'editor' })">{{
        $t("savePage.backButton")
      }}</md-button>
    </div>
    <div v-else class="infobox">
      <p v-if="exportJson">{{ $t("savePage.jsonSubtitle") }}</p>
      <p v-else>{{ $t("savePage.savSubtitle") }}</p>
      <div class="progressbar">
        <div class="content" v-bind:style="{ width: progress + '%' }"></div>
      </div>
      <p class="secondary">{{ infoText }}</p>
    </div>

    <md-dialog :md-active.sync="showErrorDialog">
      <md-dialog-title>{{ $t("openPage.errorTitle") }}</md-dialog-title>
      <span class="dialog-content">{{ errorText }}</span>
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
import { setTimeout } from "timers";
import * as Sentry from "@sentry/browser";

import { Json2Sav } from "satisfactory-json";

import { reportMessage, reportError } from "@/ts/errorReporting";

export default {
  name: "SaveBox",
  data: function() {
    return {
      isSaving: true,
      progress: 0,
      infoText: this.$t("savePage.initializing"),
      showErrorDialog: false,
      errorText: "",
      exportJson: false
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
      // The user needs to load a file first
      this.$router.push({
        name: "landingpage"
      });
    }
  },
  mounted() {
    if (!this.dataLoaded) {
      // The user needs to load a file first
      this.$router.push({
        name: "landingpage"
      });
      return;
    }
    this.exportJson = this.$route.path === "/save/json";
    this.saveFile();
  },
  methods: {
    handleError(errorMessage) {
      this.showErrorDialog = true;
      this.errorText = errorMessage;
      this.isSaving = false;
      this.progress = 0;
    },
    saveFile() {
      try {
        this.isSaving = true;
        this.infoText = this.$t("savePage.readingFile");

        var data;
        if (this.exportJson) {
          data = JSON.stringify(window.data);
        } else {
          data = new Json2Sav(window.data).transform();
        }

        var element = document.createElement("a");

        var blob = new Blob([Buffer.from(data, "binary")], {
          type: "application/octet-stream"
        });

        this.infoText = this.$t("savePage.processingFile");
        this.progress = 50;
        this.buildInterval = setInterval(() => {
          this.progress += 1;
          if (this.progress >= 100) {
            this.progress = 100;
            clearInterval(this.buildInterval);
            setTimeout(() => {
              reportMessage("saved file");

              element.href = window.URL.createObjectURL(blob);
              if (this.exportJson) {
                // TODO make sure we only cut of the extension
                element.download =
                  this.filename.replace(".json", "").replace(".sav", "") +
                  ".json";
              } else {
                element.download =
                  this.filename.replace(".json", "").replace(".sav", "") +
                  ".sav";
              }

              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
              this.isSaving = false;
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
