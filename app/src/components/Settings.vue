<template>
  <div class="settings">
    <h3>Graphics</h3>
    <md-field>
      <label>Near Field</label>
      <md-input v-model="filterTerm"></md-input>
    </md-field>
    <md-field>
      <label>Far Field</label>
      <md-input v-model="filterTerm"></md-input>
    </md-field>

    <md-checkbox>Show models</md-checkbox><br />
    <md-checkbox>Show custom paints</md-checkbox><br />
    <md-checkbox>Show map</md-checkbox>

    <md-field>
      <label>Conveyor Belt Resolution</label>
      <md-input v-model="filterTerm"></md-input>
    </md-field>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
export default {
  name: "Settings"
};
</script>
