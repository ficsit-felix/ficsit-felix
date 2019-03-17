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
        v-bind:key="index"
        v-bind:class="{ selected: index == selectedIndex }"
        @click="select(index)"
      >
        {{ obj }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";

.object-list {
  width: 300px;
  flex-shrink: 0;
  background: $middleGray;
  border-right: 1px solid $toolbarGray;
  display: flex;
  flex-direction: column;

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
      filterTerm: ""
    };
  },
  computed: {
    ...mapState(["selectedIndex"]),
    ...mapGetters(["getNames"]),
    displayedNames() {
      if (this.filterTerm.length < 3) {
        return this.getNames;
      }
      return this.getNames.filter(text => text.indexOf(this.filterTerm) > -1);
    }
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
    }
  }
};
</script>
