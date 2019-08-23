<template>
  <div class="licenses">
    {{ licenses }}
  </div>
</template>

<script>
export default {
  name: 'LicensesDialog',
  data: function() {
    return {
      licenses: 'loading...'
    };
  },
  mounted() {
    import('@/js/licenses').then(module => (this.licenses = module.licenses));
  }
};
</script>

<style>
.licenses {
  white-space: pre-line;
}
</style>
