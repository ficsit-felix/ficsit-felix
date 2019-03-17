<template>
  <div class="object-list">
    <div class="filter-field">
      <md-field md-inline>
        <label>Filter</label>
        <md-input v-model="filterTerm"></md-input>
        <md-icon>search</md-icon>
      </md-field>
    </div>
    <virtual-list
      :size="10"
      :remain="100"
      class="scroller"
      ref="list"
      :start="listStart"
    >
      <div
        v-for="item of displayedNames"
        :key="item.id"
        v-bind:class="{ selected: item.id == selectedIndex }"
        @click="select(item.id)"
        class="item"
      >
        {{ item.text }}
      </div>
    </virtual-list>
    <!-- <RecycleScroller
    page-mode
      class="scroller"
      :items="displayedNames"
      key-field="id"
      :item-size="1"
    >
      <template v-slot="{ item }">
        <div class="item"
        v-bind:class="{ selected: item.id == selectedIndex }"
        @click="select(item.id)"
        >{{item.text}}</div>
      </template>
    </RecycleScroller> -->
    <!--
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
    -->
  </div>
</template>

<style lang="scss">
@import "@/assets/colors.scss";

.scroller,
.list {
  height: 100%;
  overflow-y: scroll;
}
.item {
  height: 20px;
  padding: 0px 8px;
}

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
    padding: 8px;
    margin: 0px;
  }
}

ul {
  list-style: none;
  padding: 0px;
  // direction: rtl; // to show the right most of the text
}

.selected {
  font-weight: bold;
  color: $textWhite;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import virtualList from "vue-virtual-scroll-list";
export default {
  name: "ObjectList",
  components: {
    virtualList
  },
  data: function() {
    return {
      filterTerm: "",
      listStart: 0
    };
  },
  computed: {
    ...mapState(["selectedIndex"]),
    ...mapGetters(["getNames"]),
    displayedNames() {
      return this.getNames.filter(
        obj =>
          obj.text.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
      );
    }
  },
  methods: {
    ...mapActions(["select"]),
    focusSelectedObject() {
      console.log("asdf", this.$refs.list);
      this.listStart = this.selectedIndex;
      /*      this.$refs.list.$el.children[0].$el.children[this.selectedIndex].scrollIntoView({
          block: "start",
          // behavior: "smooth",
          //inline: "nearest"
        });*/
    }
  },
  watch: {
    selectedIndex(val) {
      if (val !== -1) {
        // scroll to selected object in object list
        /*this.$refs.list.children[val].scrollIntoView({
          block: "end",
          behavior: "smooth",
          inline: "nearest"
        });*/
      }
    },

    // watch getNames as else we need to recompute it every time the search changes for some reason?
    getNames(val) {
      /*    if (this.filterTerm.length < 3) {
        this.displayedNames = val;
      }
      this.displayedNames = val.filter(
        obj => obj.text.indexOf(this.filterTerm) > -1
      );*/
    }
  }
};
</script>
