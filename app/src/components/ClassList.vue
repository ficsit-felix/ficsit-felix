<template>
  <div class="class-list">
    <md-checkbox :model="allVisible" @change="changeVisibilityOfAllClasses($event)">all classes</md-checkbox>
    <ul>
      <li v-for="item in classes" v-bind:key="item.name">
        <md-checkbox
          :model="item.visible"
          @change="changeVisibility(item.name, $event)"
        >{{ item.name }}</md-checkbox>
      </li>
    </ul>
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
    }
  }
};
</script>
