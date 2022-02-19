import { DIALOG_OPEN_TIME_MS, DIALOG_PROGRESS } from '@lib/constants';
import { EventBus } from '@lib/event-bus';
import { SaveGame } from 'satisfactory-json';
import { reportError } from './errorReporting';

export interface SaveFileWriter {
  writeFile(
    saveGame: SaveGame,
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: () => void
  ): void;
}

export class SaveGameSaving {
  constructor(private vue: Vue, private fileWriter: SaveFileWriter) {}

  saveSaveGame(saveGame: SaveGame, filepath: string, asJson: boolean) {
    this.vue.$store.dispatch('setProgress', 0);
    this.vue.$store.dispatch('setProgressText', {
      title: this.vue.$t('savePage.savSubtitle'), // TODO asJson
      currentStep: this.vue.$t('savePage.processingFile'),
      showCloseButton: false
    });

    EventBus.$emit(DIALOG_PROGRESS, true);
    setTimeout(() => {
      // give the dialog time to be open
      console.time('saveFile');

      this.fileWriter.writeFile(
        window.data,
        filepath,
        asJson,
        progress => {
          this.vue.$store.dispatch('setProgress', progress);
        },
        error => {
          reportError(error);
          EventBus.$emit(DIALOG_PROGRESS, false);
          alert(error.message);
        },
        () => {
          console.timeEnd('saveFile');
          this.vue.$store.dispatch('setProgress', 100);
          this.vue.$store.dispatch('setProgressText', {
            currentStep: this.vue.$t('savePage.saveFinished'),
            showCloseButton: true
          });
        }
      );
    }, DIALOG_OPEN_TIME_MS);
  }
}
