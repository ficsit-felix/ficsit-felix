<template>
  <div class="object-list panel">
    <div class="filter-field">
      <v-text-field
        filled
        :label="$t('objectList.filterField')"
        v-model="filterTerm"
        :append-icon="filterTerm ? null : 'mdi-magnify'"
        hide-details
        clearable
      ></v-text-field>
    </div>
    <virtual-list
      :estimated-size="22"
      :keeps="100"
      class="scroller"
      ref="list"
      :start="listStart"
      :data-component="item"
      :data-sources="displayedNames"
      :data-key="'pathName'"
    ></virtual-list>
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
      if (!this.filterTerm) {
        return this.getNames;
      }
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
    /*margin-top: -16px;
    margin-bottom: -10px;*/
    /*padding: 0px 8px;*/
    flex-shrink: 0;
    margin-bottom: 4px;
  }
}

ul {
  list-style: none;
  padding: 0px;
  // direction: rtl; // to show the right most of the text
}
</style>
