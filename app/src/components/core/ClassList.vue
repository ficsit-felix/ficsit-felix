<template>
  <div class="class-list panel">
    <div class="content">
      <v-checkbox
        :input-value="allVisible"
        @change="changeVisibilityOfAllClasses($event)"
        :label="$t('classList.allClasses')"
        hide-details
      ></v-checkbox>
      <ul>
        <li v-for="item in classes" v-bind:key="item.name">
          <div
            v-if="editClassColors"
            class="color"
            v-bind:style="{ background: classColorStrings[item.name] }"
            @click="showColor(item.name)"
          ></div>
          <v-checkbox
            :input-value="item.visible"
            @change="changeVisibility(item.name, $event)"
            :label="item.name"
            hide-details
          ></v-checkbox>
        </li>
      </ul>

      <v-dialog width="300" v-model="showColorDialog">
        <v-card>
          <v-card-title>{{ $t('dialog.color.title') }}</v-card-title>
          <v-card-text>
            <colorPicker
              :color="selectedColor"
              @changeColor="changeColor"
            ></colorPicker>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="showColorDialog = false" color="primary">{{
              $t('general.close')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import colorPicker from '@caohenghu/vue-colorpicker';
import { modelConfig } from '@/definitions/models';

export default {
  name: 'ClassList',
  components: {
    colorPicker
  },
  data: function() {
    return {
      showColorDialog: false,
      selectedClassName: '',
      selectedColor: '#ff00ff'
    };
  },
  computed: {
    ...mapState(['classes']),
    ...mapState('settings', ['classColors', 'editClassColors']),
    allVisible: function() {
      return this.classes.every(item => item.visible == true);
    },
    classColorStrings() {
      // https://stackoverflow.com/a/37796055
      function getHexColor(number) {
        return '#' + (number >>> 0).toString(16).slice(-6);
      }
      let result = {};

      this.classes.forEach(clazz => {
        if (this.classColors[clazz.name] !== undefined) {
          result[clazz.name] = this.classColors[clazz.name];
          return;
        }

        if (modelConfig[clazz.name] === undefined) {
          return '#ff00ff';
        }
        result[clazz.name] = getHexColor(modelConfig[clazz.name].color);
      });
      return result;
    }
  },
  methods: {
    ...mapActions(['setVisibility', 'setVisibilityForAll']),
    ...mapActions('settings', ['setClassColor']),
    changeVisibility(name, visible) {
      this.setVisibility({ name, visible });
    },
    changeVisibilityOfAllClasses(visible) {
      /*this.classes.forEach(item => {
        this.setVisibility({ name: item.name, visible });
      });*/
      this.setVisibilityForAll(visible);
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
        color: color.hex
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.class-list {
  .content {
    height: 100%;
    overflow: scroll;
  }
  ul {
    list-style-type: none;
    padding: 0px;
  }

  height: 100%;

  user-select: none;

  li {
    height: 28px;
    white-space: nowrap;
    display: flex;
  }
  .color {
    width: 19px;
    height: 19px;
    border: 1px solid #eee;
    display: inline-block;
    margin-left: 2px;
    margin-right: 8px;
    border-radius: 3px;
    cursor: pointer;
    flex-shrink: 0;
    // match the v-input--selection-controls
    margin-top: 22px;
  }
}

// Custom font size
::v-deep .v-label {
  font-size: 14px;
}

// Customize the color picker
::v-deep .colors {
  padding-left: 0px;
}
::v-deep .hu-color-picker {
  width: 218px !important;
}
::v-deep .color-alpha {
  // don't display alpha
  display: none;
}

::v-deep .color-type:nth-child(4) {
  // don't display rgba type
  display: none !important;
}

::v-deep .color-set {
  justify-content: center;
}
</style>

<style lang="scss"></style>
