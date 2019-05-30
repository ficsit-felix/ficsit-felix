<template>
  <div class="licenses">
    {{ licenses }}
  </div>
</template>

<style>
.licenses {
  white-space: pre-line;
}
</style>

<script>
export default {
  name: "LicensesDialog",
  data: function() {
    return {
      licenses: "loading..."
    };
  },
  mounted() {
    import("@/js/licenses").then(module => (this.licenses = module.licenses));
  }
};
</script>
