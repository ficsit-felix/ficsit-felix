<template>
  <div>
    <span
      class="lang"
      v-for="lang in languages"
      :key="lang"
      @click="changeLang(lang)"
      :class="{ active: lang === $i18n.locale }"
    >
      {{ lang.toUpperCase() }}
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { EventBus } from '../../event-bus';
import { CHANGE_LOCALE } from '../../ts/constants';

export default {
  name: 'LanguageSwitcher',
  data: function() {
    return {
      languages: ['en', 'de']
    };
  },
  methods: {
    ...mapActions('settings', ['setLocale']),
    changeLang(lang) {
      if (this.$i18n.locale === lang) {
        return;
      }
      // dynamically load locale
      import(`@/lang/${lang}.json`).then(msgs => {
        this.$i18n.setLocaleMessage(lang, msgs.default || msgs);
        this.$i18n.locale = lang;
        this.setLocale(lang);
        EventBus.$emit(CHANGE_LOCALE);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.lang {
  display: inline-block;
  padding: 11px;
  margin: 5px;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  color: #888;
}
.lang.active {
  color: #666;
}
.lang:hover {
  background: rgba(128, 128, 128, 0.2);
}
</style>
