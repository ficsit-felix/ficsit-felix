import Vue from 'vue';
import { EventBus } from '@/event-bus';
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  DIALOG_BUGREPORT
} from '@/ts/constants';
import { v4 } from 'uuid';
import { reportContext } from '@/ts/errorReporting';
import { SaveGame } from 'satisfactory-json';

export interface SaveFileReader {
  readFile(
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: (saveGame: SaveGame) => void
  ): void;
}

// Class that handles the pipeline from the moment that the file is known to the moment the editor is fully loaded
export class SaveGameLoading {
  constructor(private vue: Vue, private fileReader: SaveFileReader) {}

  loadSaveGame(filename: string, filepath: string, asJson: boolean) {
    // TODO check extension

    // Show progress bar dialog with 0 progress
    this.vue.$store.dispatch('setProgressText', {
      title: this.vue.$t('openPage.subtitleSav'), // TODO asJson
      currentStep: this.vue.$t('openPage.readingFile'),
      showCloseButton: false
    });
    this.vue.$store.dispatch('setProgress', 0);
    EventBus.$emit(DIALOG_PROGRESS, true);

    // give the dialog time to be open
    setTimeout(() => {
      // Create uuid
      const uuid = v4();
      this.vue.$store.dispatch('setUUID', uuid);
      this.vue.$store.dispatch('setFilename', filename);
      this.vue.$store.dispatch('setFilepath', filepath);

      // Report uuid and save file name to Sentry
      reportContext('uuid', uuid);
      reportContext('savename', filename);

      this.fileReader.readFile(
        filepath,
        asJson,
        progress => {
          this.vue.$store.dispatch('setProgress', progress);
        },
        error => {
          EventBus.$emit(DIALOG_BUGREPORT, error.message);
        },
        saveGame => {
          // Process the loaded data for vuex
          this.vue.$store.dispatch('setLoadedData', saveGame).then(() => {
            // Show the save entries in the desktop menu TODO move to desktop component?
            this.vue.$store.dispatch('setShowSaveMenuEntries', true);
            this.vue.$router.push({
              name: 'loadEditor'
            });
          });
        }
      );
    }, DIALOG_OPEN_TIME_MS);
  }
}
