<template>
  <ul>
    <li v-for="lang in languages" :key="lang" @click="changeLang(lang)">
      {{ lang }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  data: function() {
    return {
      languages: ["en", "de"]
    };
  },
  methods: {
    changeLang(lang) {
      if (this.$i18n.locale === lang) {
        return;
      }
      // dynamically load locale
      import(`@/lang/${lang}.json`).then(msgs => {
        this.$i18n.setLocaleMessage(lang, msgs.default || msgs);
        this.$i18n.locale = lang;
      });
    }
  }
};
</script>
