<template>
  <div>
    <v-dialog
      width="600"
      :value="value"
      @input="
        newValue => {
          this.$emit('input', newValue);
        }
      "
    >
      <v-card tile>
        <v-card-title v-text="$t('photoMode.title')"></v-card-title>
        <v-card-text>
          <canvas ref="finalImage"></canvas>

          <div class="d-flex">
            <v-text-field
              :label="$t('photoMode.width')"
              :value="width"
              @change="changeWidth"
              type="number"
              width="4"
              class="my-2 mr-2"
              hide-details
            ></v-text-field>
            <v-text-field
              :label="$t('photoMode.height')"
              :value="height"
              @change="changeHeight"
              type="number"
              class="my-2 ml-2"
              hide-details
            ></v-text-field>
          </div>
          <v-text-field
            :label="$t('photoMode.text')"
            :value="text"
            @change="changeText"
            hide-details
          ></v-text-field>
          <div id="logobox">
            <Logo black="#ffffff" ref="logo"></Logo>
          </div>
          <v-checkbox
            :input-value="includeLogo"
            @change="changeIncludeLogo"
            :label="$t('photoMode.includeLogo')"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn text @click="cancel()">{{ $t('general.cancel') }}</v-btn>
          <v-btn text @click="download()" color="primary">
            {{ $t('photoMode.downloadButton') }}
          </v-btn>
          <v-btn
            text
            @click="copyToClipboard()"
            color="primary"
            v-if="clipboardAvailable"
          >
            {{ $t('photoMode.clipboardButton') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showDownloadSnack" :timeout="2000">{{
      $t('photoMode.downloaded')
    }}</v-snackbar>
    <v-snackbar v-model="showClipboardSnack" :timeout="2000">{{
      $t('photoMode.copiedToClipboard')
    }}</v-snackbar>
  </div>
</template>

<script lang="ts">
import {
  Component as VueComponent,
  Vue,
  Prop,
  Watch,
  Ref
} from 'vue-property-decorator';
import { EventBus } from '../../../lib/core/event-bus';
import { SCENE_RESIZE } from '../../../lib/core/constants';
import Logo from '../Logo.vue';

@VueComponent({
  components: {
    Logo
  }
})
export default class PhotoModeDialog extends Vue {
  @Prop() value!: boolean;
  @Prop() title!: string;
  @Prop() content!: string;
  @Ref() finalImage!: HTMLCanvasElement;
  @Ref() logo!: Logo;
  screenshotImage = new Image();
  width: number = 1920;
  height: number = 1080;
  text: string = '';
  logoImage = new Image();
  includeLogo: boolean = true;
  logoLoaded = false;
  showDownloadSnack = false;
  showClipboardSnack = false;
  clipboardAvailable = false;

  @Watch('value')
  onValueChange(value: boolean) {
    if (value) {
      // wait
      setTimeout(this.takeScreenshot, 100);
    }
  }

  mounted() {
    // Check for availability of new clipboard api
    this.clipboardAvailable =
      navigator.clipboard !== undefined &&
      (navigator.clipboard as any).write !== undefined;
    setTimeout(() => {}, 1000);
  }

  takeScreenshot() {
    if (this.includeLogo && !this.logoLoaded) {
      this.logoLoaded = true;
      this.loadLogo();
    }

    const scene = document.getElementById('scene');
    if (scene !== undefined && scene !== null) {
      const canvas = scene.getElementsByTagName('canvas')[0];

      if (canvas !== undefined && canvas !== null) {
        const origWidth = canvas.width;
        const origHeight = canvas.height;
        // Set scene to correct size
        scene.style.width = this.width + 'px';
        scene.style.height = this.height + 'px';
        this.finalImage.width = this.width;
        this.finalImage.height = this.height;
        scene.style.opacity = '0';

        EventBus.$emit(SCENE_RESIZE);
        setTimeout(() => {
          this.screenshotImage.src = canvas.toDataURL('image/jpeg');

          var ctx = this.finalImage.getContext('2d')!;
          // Draw screenshot
          ctx.drawImage(canvas, 0, 0);

          const scale = Math.min(this.width, this.height) / 1000;
          const padding = Math.ceil(scale * 20);

          // Draw logo
          if (this.includeLogo && this.logoImage.complete) {
            const width = this.logoImage.width * scale;
            const height = this.logoImage.height * scale;
            ctx.drawImage(
              this.logoImage,
              this.width - width - padding,
              this.height - height - padding,
              width,
              height
            );
          }
          // Draw text
          ctx.fillStyle = '#ffffff';
          const textHeight = Math.ceil(50 * scale);
          ctx.font = textHeight + 'px Arial';
          ctx.fillText(this.text, 2 * padding, textHeight + 1.5 * padding);

          // Reset scene
          scene.style.width = '';
          scene.style.height = '';
          scene.style.opacity = '1';
          EventBus.$emit(SCENE_RESIZE);
        }, 50);
      }
    } else {
      // TODO display error?
      //this.screenshotDataUrl = '';
    }
  }

  // Load the logo from the Vue component svg
  loadLogo() {
    const svg = document
      .getElementById('logobox')
      ?.getElementsByTagName('svg')[0];

    // Firefox needs these explicitely set to draw the SVG to a canvas
    svg!.setAttribute('width', '300');
    svg!.setAttribute('height', '118');
    const imageData = svg?.outerHTML ?? '';
    this.logoImage.src = 'data:image/svg+xml,' + encodeURIComponent(imageData);
  }

  changeWidth(width: number) {
    this.width = width;
    this.takeScreenshot();
  }

  changeHeight(height: number) {
    this.height = height;
    this.takeScreenshot();
  }

  changeText(text: string) {
    this.text = text;
    this.takeScreenshot();
  }

  changeIncludeLogo(includeLogo: boolean) {
    this.includeLogo = includeLogo;
    this.takeScreenshot();
  }

  cancel() {
    this.$emit('input', false);
  }

  download() {
    this.showDownloadSnack = true;
    var link = document.createElement('a');
    let filename = 'FeliX-photo.png';
    if (this.text.length > 0) {
      filename = this.text + '.png';
    }
    link.download = filename;
    link.href = this.finalImage.toDataURL();
    var event = new MouseEvent('click');
    // dispatching it will open a save as dialog in FF
    link.dispatchEvent(event);
    this.$emit('input', false);
  }

  copyToClipboard() {
    this.showClipboardSnack = true;
    // Use new clipboard api to copy image blob to clipboard
    this.finalImage.toBlob(function(blob) {
      //@ts-ignore
      const item = new ClipboardItem({ 'image/png': blob });
      //@ts-ignore
      navigator.clipboard.write([item]);
    });
    this.$emit('input', false);
  }
}
</script>

<style lang="scss" scoped>
::v-deep canvas {
  max-width: 100%;
  max-height: 320px;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.2);
  //border-right-width: 2px;
  box-sizing: border-box;
}

#logobox {
  display: none;
}
</style>
