<template>
  <div class="object-list panel">
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
      :item="item"
      :itemcount="displayedNames.length + 1"
      :itemprops="getItemProps"
    >
    </virtual-list>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import virtualList from 'vue-virtual-scroll-list';
import ObjectListItem from './ObjectListItem.vue';
export default {
  name: 'ObjectList',
  components: {
    virtualList
  },
  data: function() {
    return {
      filterTerm: '',
      listStart: 0,

      item: ObjectListItem
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
    },

    getItemProps(itemIndex) {
      if (itemIndex == 0) {
        return {
          key: 0,
          props: {
            index: 0
          }
        };
      }

      return {
        key: this.displayedNames[itemIndex - 1].pathName,
        props: {
          height: 32,
          index: itemIndex,
          info: this.displayedNames[itemIndex - 1]
        }
      };
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
  overflow-y: scroll !important;
}

.object-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  user-select: none;

  .filter-field {
    margin-top: -16px;
    margin-bottom: -10px;
    /*padding: 0px 8px;*/
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
</style>
