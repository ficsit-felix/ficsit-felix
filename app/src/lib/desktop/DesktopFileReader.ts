import { SaveFileReader, SaveGameLoading } from '../core/SaveGameLoading';
import { SaveGame } from 'satisfactory-json';
import { openFileFromFilesystem } from './openFile';

class DesktopFileReader implements SaveFileReader {
  readFile(
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: (saveGame: SaveGame) => void
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
