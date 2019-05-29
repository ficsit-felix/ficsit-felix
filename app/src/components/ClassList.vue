<template>
  <div class="class-list">
    <md-checkbox :model="allVisible" @change="changeVisibilityOfAllClasses($event)">all classes</md-checkbox>
    <ul>
      <li v-for="item in classes" v-bind:key="item.name">
        <div class="color" v-bind:style=" {background: item.color}" @click="showColor(item.name)"></div>
        <md-checkbox
          :model="item.visible"
          @change="changeVisibility(item.name, $event)"
        >{{ item.name }}</md-checkbox>
      </li>
    </ul>

    <md-dialog :md-active.sync="showColorDialog">
      <md-dialog-title>Select color</md-dialog-title>
      <md-dialog-content class="colorPickerDialogContent">
        <colorPicker
          :color="selectedColor"
        ></colorPicker>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showColorDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

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
  .alpha { // don't display alpha
    display: none;
  }
  .color-type:nth-child(4) { // don't display rgba type
    display: none !important;
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import colorPicker from "@caohenghu/vue-colorpicker";

export default {
  name: "ClassList",
  components: {
    colorPicker
  },
  data: function() {
    return {
      showColorDialog: false,
      selectedColor: "#ff00ff"
    };
  },
  computed: {
    ...mapState(["classes"]),
    allVisible: function() {
      return this.classes.every(item => item.visible == true);
    }
  },
  methods: {
    ...mapActions(["setVisibility"]),
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
      
      this.showColorDialog = true;
    }
  }
};
</script>
