import { SaveGame } from 'satisfactory-json';
import { SaveFileWriter } from '../core/SaveGameSaving';
import { saveFileToFilesystem } from '../core/saveFile';

export class WebFileWriter implements SaveFileWriter {
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
