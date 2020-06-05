import { SaveFileWriter, SaveGameSaving } from '../core/SaveGameSaving';
import { SaveGame } from 'satisfactory-json';
import { saveFileToFilesystem } from './saveFile';

class DesktopFileWriter implements SaveFileWriter {
  writeFile(
    saveGame: SaveGame,
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: () => void
  ): void {
    saveFileToFilesystem(
      saveGame,
      filepath,
      asJson,
      (err, progress, success) => {
        if (err) {
          errorCallback(err);
          return;
        }

        if (progress) {
          progressCallback(progress);
          return;
        }

        if (success) {
          successCallback();
        }
      }
    );
  }
}

export function saveFileAndShowProgress(
  vue: Vue,
  path: string,
  asJson: boolean,
  asZip: boolean
) {
  new SaveGameSaving(vue, new DesktopFileWriter()).saveSaveGame(
    window.data,
    path,
    asJson
  );
  /*  vue.$store.dispatch('setProgress', 0);
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
        }, DIALOG_OPEN_TIME_MS);*/
}
