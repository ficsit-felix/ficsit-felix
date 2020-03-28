<template>
  <div v-if="index === 0">
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
  </div>
  <div v-else>
    <div
      :key="info.pathName"
      v-bind:class="{ selected: selectedPathNames.includes(info.pathName) }"
      @click="select([info.pathName])"
      class="item"
    >
      {{ info.text }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ObjectListItem',
  props: {
    index: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default: () => ({
        pathName: ''
      })
    }
  },
  computed: {
    ...mapState(['selectedPathNames'])
  },
  methods: {
    ...mapActions(['select']),
    getAbbrName(name) {
      const arr = name.split(' ');
      if (arr.length > 1) {
        return arr[0][0] + arr[1][0];
      } else {
        return name.substr(0, 2);
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/colors.scss';

.selected {
  font-weight: bold;
  color: $textWhite;
}

.item {
  height: 22px;
  /*padding: 0px 8px;*/
  cursor: pointer;
}
</style>
