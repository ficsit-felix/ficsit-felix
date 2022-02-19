<template>
  <div class="licenses">
    {{ licenses }}
  </div>
</template>

<script>
export default {
  name: 'LicensesDialog',
  data: function () {
    return {
      licenses: 'loading...',
    };
  },
  mounted() {
    setTimeout(
      () =>
        window
          .fetch('/licenses.txt')
          .then((response) => response.text())
          .then((text) => (this.licenses = text)),
      200 // Delay a short bit to actually show the dialog already while loading
    );
  },
};
</script>

<style>
.licenses {
  white-space: pre-line;
}
</style>
