<template>
  <div class="object-list">
    <div class="filter-field">
      <md-field md-inline>
        <label>{{ $t('objectList.filterField') }}</label>
        <md-input v-model="filterTerm"></md-input>
        <md-icon>search</md-icon>
      </md-field>
    </div>
    <virtual-list
      :size="20"
      :remain="100"
      class="scroller"
      ref="list"
      :start="listStart"
    >
      <div
        v-bind:class="{
          selected:
            selectedPathNames.length === 1 &&
            selectedPathNames[0] === '---save-header---'
        }"
        @click="select(['---save-header---'])"
        class="item"
      >
        {{ $t('objectList.saveHeader') }}
      </div>
      <div
        v-for="item of displayedNames"
        :key="item.pathName"
        v-bind:class="{ selected: selectedPathNames.includes(item.pathName) }"
        @click="select([item.pathName])"
        class="item"
      >
        {{ item.text }}
      </div>
    </virtual-list>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import virtualList from 'vue-virtual-scroll-list';
export default {
  name: 'ObjectList',
  components: {
    virtualList
  },
  data: function() {
    return {
      filterTerm: '',
      listStart: 0
    };
  },
  computed: {
    ...mapState(['selectedPathNames']),
    ...mapGetters(['getNames']),
    displayedNames() {
      return this.getNames.filter(
        obj =>
          obj.text.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
      );
    }
  },
  methods: {
    ...mapActions(['select']),
    focusSelectedObject() {
      if (this.selectedPathNames.length > 0) {
        // TODO optimize
        for (let i = 0; i < this.displayedNames.length; i++) {
          if (this.displayedNames[i].pathName === this.selectedPathNames[0]) {
            this.listStart = i + 1;
            return;
          }
        }
      }
    }
  },
  watch: {
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

<style lang="scss" scoped>
@import '@/assets/colors.scss';

.scroller,
.list {
  height: 100%;
  overflow-y: scroll;
}
.item {
  height: 20px;
  padding: 0px 8px;
  cursor: pointer;
}

.object-list {
  background: $middleGray;
  border-right: 1px solid $toolbarGray;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  user-select: none;

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
