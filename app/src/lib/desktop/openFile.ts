import fs from 'fs';
import { sav2json, SaveGame, Sav2JsonTransform } from 'satisfactory-json';

/**
 * Read files on desktop
 * @param path
 * @param asJson
 * @param callback
 */
export function openFileFromFilesystem(
  path: string,
  asJson: boolean,
  callback: (err?: Error, progress?: number, saveGame?: SaveGame) => void
): void {
  console.time('readDesktop');
  window.data = path;
  if (asJson) {
    fs.readFile(path, (err, data) => {
      console.timeEnd('readDesktop');
      if (err) {
        // TODO display a user visible error message
        console.error(err);
        callback(err, undefined, undefined);
        return;
      }

      callback(undefined, 25, undefined);
      setTimeout(() => {
        // TODO refactor: move common (desktop/web) code into own file
        try {
          const json = JSON.parse(data.toString('utf-8'));
          callback(undefined, 50, undefined);
          callback(undefined, undefined, json);
        } catch (err) {
          callback(err, undefined, undefined);
        }
      }, 100);
    });
  } else {
    const stream = fs.createReadStream(path);
    const sav2json = new Sav2JsonTransform();
    stream
      .pipe(sav2json)
      .on('data', (saveGame: SaveGame) => {
        console.timeEnd('readDesktop');
        callback(undefined, undefined, saveGame);
      })
      .on('progress', (progress: number) => {
        callback(undefined, progress, undefined);
      })
      .on('error', error => {
        callback(error, undefined, undefined);
      });
  }
  /*
    fs.readFile(path, (err, data) => {
      console.timeEnd('readDesktop');
      if (err) {
        // TODO display a user visible error message
        console.error(err);
        callback(err, undefined, undefined);
        return;
      }
  
      callback(undefined, 25, undefined);
  
      setTimeout(() => {
        // TODO refactor: move common (desktop/web) code into own file
        try {
          let json;
          if (asJson) {
            json = JSON.parse(data.toString('utf-8'));
          } else {
            console.time('sav2json');
            json = sav2json(data);
            console.timeEnd('sav2json');
          }
          callback(undefined, 50, undefined);
          callback(undefined, undefined, json);
        } catch (err) {
          callback(err, undefined, undefined);
        }
      }, 100);
    });*/
}
