import { SaveGame } from 'satisfactory-json';
import { SaveFileWriter, SaveGameSaving } from '../core/SaveGameSaving';
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
}
