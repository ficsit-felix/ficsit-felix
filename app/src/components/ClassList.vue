<template>
  <div class="class-list">
    <md-checkbox
      :model="allVisible"
      @change="changeVisibilityOfAllClasses($event)"
      >{{ $t("classList.allClasses") }}</md-checkbox
    >
    <ul>
      <li v-for="item in classes" v-bind:key="item.name">
        <div
          v-if="editClassColors"
          class="color"
          v-bind:style="{ background: classColorStrings[item.name] }"
          @click="showColor(item.name)"
        ></div>
        <md-checkbox
          :model="item.visible"
          @change="changeVisibility(item.name, $event)"
          >{{ item.name }}</md-checkbox
        >
      </li>
    </ul>

    <md-dialog :md-active.sync="showColorDialog">
      <md-dialog-title>{{ $t("dialog.color.title") }}</md-dialog-title>
      <md-dialog-content class="colorPickerDialogContent">
        <colorPicker
          :color="selectedColor"
          @changeColor="changeColor"
        ></colorPicker>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showColorDialog = false">{{
          $t("general.close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import colorPicker from "@caohenghu/vue-colorpicker";
import { modelConfig } from "@/definitions/models";

export default {
  name: "ClassList",
  components: {
    colorPicker
  },
  data: function() {
    return {
      showColorDialog: false,
      selectedClassName: "",
      selectedColor: "#ff00ff"
    };
  },
  computed: {
    ...mapState(["classes"]),
    ...mapState("settings", ["classColors", "editClassColors"]),
    allVisible: function() {
      return this.classes.every(item => item.visible == true);
    },
    classColorStrings() {
      // https://stackoverflow.com/a/37796055
      function getHexColor(number) {
        return "#" + (number >>> 0).toString(16).slice(-6);
      }
      var result = {};

      this.classes.forEach(clazz => {
        if (this.classColors[clazz.name] !== undefined) {
          result[clazz.name] = this.classColors[clazz.name];
          return;
        }

        if (modelConfig[clazz.name] === undefined) {
          console.error(
            "Trying to access missing model config of class " + clazz.name
          );
          return "#ff00ff";
        }
        result[clazz.name] = getHexColor(modelConfig[clazz.name].color);
      });
      return result;
    }
  },
  methods: {
    ...mapActions(["setVisibility"]),
    ...mapActions("settings", ["setClassColor"]),
    changeVisibility(name, visible) {
      this.setVisibility({ name, visible });
    },
    changeVisibilityOfAllClasses(visible) {
      this.classes.forEach(item => {
        this.setVisibility({ name: item.name, visible });
      });
    },
    showColor(className) {
      // alert(className);
      // TODO set correct color in color dialog
      this.selectedClassName = className;
      this.selectedColor = this.classColorStrings[className];

      this.showColorDialog = true;
    },
    changeColor(color) {
      // TODO debounce this color change a bit

      this.setClassColor({
        className: this.selectedClassName,
        color: color.rgba.toHexString()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.class-list {
  ul {
    list-style-type: none;
    padding: 0px;
  }

  background: $middleGray;
  height: 100%;
  overflow: scroll;
  user-select: none;

  li {
    height: 28px;
    white-space: nowrap;
  }
  .color {
    width: 19px;
    height: 19px;
    border: 1px solid #eee;
    display: inline-block;
    margin-left: 8px;
    margin-right: 8px;
    border-radius: 3px;
    cursor: pointer;
  }

  .md-checkbox {
    margin: 3px 8px;
    white-space: nowrap;
  }
  .md-checkbox .md-checkbox-container:before {
    width: 26px;
    height: 26px;
  }

  .md-checkbox .md-checkbox-label {
    padding-left: 10px;
  }
}
</style>

<style lang="scss">
.colorPickerDialogContent {
  .hu-color-picker {
    width: 218px !important;
  }
  .alpha {
    // don't display alpha
    display: none;
  }
  .color-type:nth-child(4) {
    // don't display rgba type
    display: none !important;
  }
}
</style>
