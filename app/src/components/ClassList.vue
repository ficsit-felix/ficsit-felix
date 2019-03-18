<template>
  <div class="class-list">
    <ul>
      <li v-for="item in classes" v-bind:key="item.name">
        <md-checkbox
          :model="item.visible"
          @change="changeVisibility(item.name, $event)"
        >
          {{ item.name }}
        </md-checkbox>
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
@import "@/assets/colors.scss";

.class-list {
  background: $middleGray;
  height: 100%;
  overflow: scroll;
    user-select: none;
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
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "ClassList",
  computed: {
    ...mapState(["classes"])
  },
  methods: {
    ...mapActions(["setVisibility"]),
    changeVisibility(name, visible) {
      this.setVisibility({ name, visible });
      console.log("visibility" + name + "," + visible);
    }
  }
};
</script>
