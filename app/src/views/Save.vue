<template>
  <div class="save">
    <CenterWhiteBox>
      <Logo :height="180" black="#000" :animating="logoAnimating" />
      <h1>{{ $t('savePage.title') }}</h1>
      <SaveBox
        @startAnimating="logoAnimating = true"
        @stopAnimating="logoAnimating = false"
      />
    </CenterWhiteBox>
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import SaveBox from '@/components/SaveBox';
import CenterWhiteBox from '@/components/CenterWhiteBox';

export default {
  name: 'Save',
  components: {
    Logo,
    SaveBox,
    CenterWhiteBox
  },
  data: function() {
    return {
      logoAnimating: true
    };
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/colors.scss';
.save {
  display: flex;
  height: 100%;
  overflow: auto;
}
</style>
