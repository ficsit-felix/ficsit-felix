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
      :data-component="item"
      :data-sources="displayedNames"
      :data-key="'pathName'"
    ></virtual-list>
  </div>
</template>

<script>
import { FOCUS_SELECTED_OBJECT } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import virtualList from 'vue-virtual-scroll-list';
import { mapActions, mapGetters, mapState } from 'vuex';
import ObjectListItem from '../ObjectListItem.vue';

export default {
  name: 'ObjectListPanel',
  components: {
    virtualList
  },
  data: function() {
    return {
      filterTerm: '',
      item: ObjectListItem
    };
  },
  computed: {
    ...mapState(['selectedPathNames']),
    ...mapGetters(['getNames']),
    displayedNames() {
      if (!this.filterTerm) {
        return [{ pathName: '---save-header---', text: '' }, ...this.getNames];
      }
      return this.getNames.filter(
        obj =>
          obj.text.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1
      );
    }
  },
  created() {
    EventBus.$on(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
  },
  beforeDestroy() {
    EventBus.$off(FOCUS_SELECTED_OBJECT, this.focusSelectedObject);
  },
  methods: {
    ...mapActions(['select']),
    focusSelectedObject() {
      if (this.selectedPathNames.length > 0) {
        // TODO optimize
        for (let i = 0; i < this.displayedNames.length; i++) {
          if (this.displayedNames[i].pathName === this.selectedPathNames[0]) {
            this.$refs.list.scrollToIndex(i);
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
