import { remote } from 'electron';
import { EventBus } from '@/event-bus';
import { Store } from 'vuex';
import {
  DIALOG_PROGRESS,
  DIALOG_OPEN_TIME_MS,
  DIALOG_BUGREPORT
} from '@/ts/constants';
import { v4 } from 'uuid';
import { reportContext } from '@/ts/errorReporting';
import { openFileFromFilesystem } from './openFile';
import Vue from 'vue';
import { saveFileToFilesystem } from './saveFile';
import { SaveFileReader, SaveGameLoading } from '../core/SaveGameLoading';

class DesktopFileReader implements SaveFileReader {
  readFile(
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: (saveGame: import('satisfactory-json').SaveGame) => void
  ): void {
    openFileFromFilesystem(filepath, asJson, (err, progress, saveGame) => {
      if (err) {
        errorCallback(err);
        return;
      }
      if (progress) {
        progressCallback(progress);
        return;
      }
      if (saveGame) {
        successCallback(saveGame);
        return;
      }
    });
  }
}

/**
 * Supply a file path to open the file
 */
export function openFileAndMoveToEditor(
  vue: Vue,
  path: string,
  asJson: boolean
) {
  const name = path.replace(/^.*[\\/]/, '');

  new SaveGameLoading(vue, new DesktopFileReader()).loadSaveGame(
    name,
    path,
    asJson
  );
}

export function saveFileAndShowProgress(
  vue: Vue,
  path: string,
  asJson: boolean,
  asZip: boolean
) {
  vue.$store.dispatch('setProgress', 0);
  vue.$store.dispatch('setProgressText', {
    title: vue.$t('savePage.savSubtitle'), // TODO asJson
    currentStep: vue.$t('savePage.processingFile'),
    showCloseButton: false
  });

  EventBus.$emit(DIALOG_PROGRESS, true);
  setTimeout(() => {
    // give the dialog time to be open

    saveFileToFilesystem(
      window.data,
      path,
      asJson,
      (err, progress, success) => {
        if (err) {
          // open bug report window
          EventBus.$emit(DIALOG_BUGREPORT, err.message);
          return;
        }

        if (progress) {
          vue.$store.dispatch('setProgress', progress);
          return;
        }

        if (success) {
          vue.$store.dispatch('setProgress', 100);
          vue.$store.dispatch('setProgressText', {
            currentStep: vue.$t('savePage.saveFinished'),
            showCloseButton: true
          });
        }
      }
    );
  }, DIALOG_OPEN_TIME_MS);
}
