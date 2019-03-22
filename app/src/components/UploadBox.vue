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

import { Sav2Json } from "@/transformation/index";
import { modelHelper } from "@/helpers/modelHelper";

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
  mounted() {
    Sentry.captureMessage("visit upload page");

    var models = {
      "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x2_01.Build_Foundation_8x2_01_C":
        "Build_Foundation_8x2_01_C.glb",
      "/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C":
        "Build_StorageContainerMk1_C.glb",
      "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
        "BP_ResourceNode_C.glb",
      "/Game/FactoryGame/Resource/BP_ResourceDeposit.BP_ResourceDeposit_C":
        "BP_ResourceDeposit_C.glb",
      "/Game/FactoryGame/Buildable/Building/Stair/Build_Stairs_Left_01.Build_Stairs_Left_01_C":
        "Build_Stairs_Left_01_C.glb", // rotate z 180 z+100
      "/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C":
        "Build_Wall_1a_C.glb",
      "/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C":
        "Build_Ramp_8x4_01_C.glb", // z -200
      "/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C":
        "Build_Foundation_8x4_01_C.glb", // z -200
      "/Game/FactoryGame/Buildable/Vehicle/BP_VehicleTargetPoint.BP_VehicleTargetPoint_C":
        "BP_VehicleTargetPoint_C.glb",
      "/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C":
        "Build_ConveyorPole_C.glb",
      "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C":
        "Build_ConveyorBelt.glb",
      "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C":
        "Build_ConveyorBelt.glb",
      "/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C":
        "Build_ConveyorBelt.glb",
      "/Game/FactoryGame/World/Benefit/NutBush/BP_NutBush.BP_NutBush_C":
        "BP_NutBush_C.glb",
      "/Game/FactoryGame/World/Benefit/Mushroom/BP_Shroom_01.BP_Shroom_01_C":
        "BP_Shroom_01_C.glb",
      "/Game/FactoryGame/World/Benefit/BerryBush/BP_BerryBush.BP_BerryBush_C":
        "BP_BerryBush_C.glb",
      "/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C":
        "Build_PowerPoleMk1_C.glb",
      "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C":
        "Build_PowerLine_C.glb",
      "/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C":
        "Build_MinerMk1_C.glb" // r z 180
    };
    for (var a in models) {
      modelHelper.loadModel("/models/" + models[a]);
    }
    requestAnimationFrame(this.loadMore.bind(this));
  },
  methods: {
    ...mapActions(["setLoadedData", "setFilename", "setUUID"]),

    loadMore() {
      modelHelper.loadFrame().then(() => {
        requestAnimationFrame(this.loadMore.bind(this));
      });
    },
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

      Sentry.captureMessage("uploaded file");

      var reader = new FileReader();
      reader.onload = response => {
        this.infoText = "processing file...";
        this.progress = 50;
        try {
          let sav2Json = new Sav2Json(Buffer.from(response.target.result));
          let json = sav2Json.transform();

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
                  this.$router.push("/");
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
