<template>
  <div></div>
</template>

<script>
// This route only exists so we can route from editor -> here -> editor in case we load a new save directly in the editor
export default {
  mounted() {
    this.$router.push({
      name: 'editor',
    });
  },
};
</script>

<style></style>
