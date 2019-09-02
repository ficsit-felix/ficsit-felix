import fs from 'fs';
import { sav2json, SaveGame } from 'satisfactory-json';

export function openFileFromFilesystem(
  path: string,
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    saveGame: SaveGame | undefined
  ) => void
): void {
  callback(undefined, 10, undefined);
  console.time('readDesktop');
  fs.readFile(path, (err, data) => {
    console.timeEnd('readDesktop');
    if (err) {
      // TODO display a user visible error message
      console.error(err);
      callback(err, undefined, undefined);
      return;
    }

    callback(undefined, 50, undefined);

    setTimeout(() => {
      // TODO refactor: move common (desktop/web) code into own file
      try {
        console.time('sav2json');
        const json = sav2json(data);
        console.timeEnd('sav2json');
        callback(undefined, 100, undefined);
        callback(undefined, undefined, json);
      } catch (err) {
        console.error(err);
      }
    }, 100);
  });
}
