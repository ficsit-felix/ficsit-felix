<template>
  <div class="object-list">
    <div class="filter-field">
      <md-field md-inline>
        <label>Filter</label>
        <md-input v-model="filterTerm"></md-input>
        <md-icon>search</md-icon>
      </md-field>
    </div>

    <ul ref="list" class="list">
      <li
        v-for="(obj, index) in displayedNames"
        v-bind:key="obj.id"
        v-bind:class="{ selected: obj.id == selectedIndex }"
        @click="select(obj.id)"
      >
        {{ obj.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";

.object-list {
  background: $middleGray;
  border-right: 1px solid $toolbarGray;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .filter-field {
    margin-top: -10px;
    margin-bottom: -10px;
    padding: 0px 8px;
    flex-shrink: 0;
  }
  .list {
    overflow-y: scroll;
    padding: 8px;
    flex-grow: 1;
    margin: 0px;
  }
}

ul {
  list-style: none;
  padding: 0px;
  // direction: rtl; // to show the right most of the text
}

li.selected {
  font-weight: bold;
  color: $textWhite;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "ObjectList",
  data: function() {
    return {
      filterTerm: "",
      displayedNames: [],
    };
  },
  computed: {
    ...mapState(["selectedIndex"]),
    ...mapGetters(["getNames"])
  },
  methods: {
    ...mapActions(["select"])
  },
  watch: {
    selectedIndex(val) {
      if (val !== -1) {
        // scroll to selected object in object list
        this.$refs.list.children[val].scrollIntoView({
          block: "end",
          behavior: "smooth",
          inline: "nearest"
        });
      }
    },

    // watch getNames as else we need to recompute it every time the search changes for some reason?
    getNames(val) {
      if (this.filterTerm.length < 3) {
        this.displayedNames = val;
      }
      this.displayedNames = val.filter(obj => obj.text.indexOf(this.filterTerm) > -1);
    }
  }
};
</script>
