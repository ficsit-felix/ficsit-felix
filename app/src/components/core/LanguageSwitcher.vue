<template>
  <div class="switcher">
    <span
      class="lang"
      v-for="lang in languages"
      :key="lang"
      @click="changeLang(lang)"
      :class="{ active: lang === $i18n.locale }"
      v-ripple
      >{{ lang.toUpperCase() }}</span
    >
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
@import '@/assets/colors.scss';

.switcher {
  margin: 16px;
}
.lang {
  display: inline-block;
  padding: 11px;
  border-radius: 0px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  user-select: none;
  color: #888;
  margin-left: -1px;
}
.lang:first-child {
  border-radius: 4px 0px 0px 4px;
}
.lang:last-child {
  border-radius: 0px 4px 4px 0px;
}
.lang.active {
  color: $primaryOrange;
  border-color: rgba(255, 204, 128, 0.6);
  background: rgba(255, 204, 128, 0.1);
}
.lang:hover {
  background: rgba(128, 128, 128, 0.5);
}
</style>
