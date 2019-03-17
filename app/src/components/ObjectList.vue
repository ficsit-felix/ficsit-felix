<template>
  <div class="object-list">
    <input v-model="filterTerm" placeholder="Filter" />
    <ul ref="list" class="list">
      <li
        v-for="(obj, index) in getNames"
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

  .list {
    overflow-y: scroll;
    padding: 8px;
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
    }
  }
};
</script>
