<template>
  <div class="property-editor">
    <md-button class="md-raised" :disabled="this.getSelectedObject == null" @click="focusSelectedObject">Focus</md-button>

    <textarea v-model="selectedJson" class="json-editor" placeholder="JSON View" readonly></textarea>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";

.property-editor {
  /*width: 300px;
  flex-shrink: 0;
  background: $middleGray;*/
  height: 100%;
  overflow: hidden;
}
.json-editor {
  width: 100%;
  height: 100%;
  color: $textGray;
  border: 0px;
  padding: 8px;
}
</style>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PropertyEditor",
  data: function() {
    return {
      selectedJson: ""
    };
  },
  computed: {
    ...mapGetters(["getSelectedObject"])
    /*selectedJson() {
            if (this.getSelectedObject == null) {
                return "";
            } else {
                return JSON.stringify(this.getSelectedObject);
            }
        }*/
  },
  watch: {
    getSelectedObject(val) {
      if (this.getSelectedObject == null) {
        this.selectedJson = "";
      } else {
        this.selectedJson = JSON.stringify(this.getSelectedObject, null, 2);
      }
    }
  },

  methods: {
    focusSelectedObject() {
      console.log("ay");
      this.$emit('focusSelectedObject')
    }
  }
};
</script>
