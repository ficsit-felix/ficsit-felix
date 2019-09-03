import { SaveGame } from 'satisfactory-json';
import Json2SavWorker from 'worker-loader?name=[name].js!@/transformation/json2sav.worker.js';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { isElectron } from '@/ts/isElectron';
import { getSaveFilesPath } from './fileUtil';
import { writeFile, fstat, existsSync, copyFileSync } from 'fs';

export function saveFileToFilesystem(
  saveGame: SaveGame,
  filename: string,
  asJson: boolean,
  asZip: boolean,
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    success: boolean | undefined
  ) => void
) {
  transformFile(callback, asZip, filename, asJson);
}
function transformFile(
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    success: boolean | undefined
  ) => void,
  asZip: boolean,
  filename: string,
  asJson: boolean
) {
  const worker = new Json2SavWorker();
  worker.addEventListener('message', message => {
    if (message.data.status === 'error') {
      callback(message.data.error, undefined, undefined);
      return;
    }
    const data = message.data.data;
    callback(undefined, 50, undefined);
    if (isElectron()) {
      // desktop version

      // TODO convert to zip

      saveDesktop(filename, data, callback);
    } else {
      // web version
      saveWeb(asZip, filename, data, callback);
    }
  });
  worker.postMessage({
    exportJson: asJson,
    data: window.data
  });
}

function saveDesktop(
  filename: string,
  data: any,
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    success: boolean | undefined
  ) => void
) {
  const path = getSaveFilesPath() + '/' + filename;

  if (existsSync(path)) {
    // make a backup
    // TODO maybe zip the backup?
    const timestamp = new Date()
      .toISOString()
      .replace('T', '_')
      .replace('Z', '');
    copyFileSync(
      path,
      getSaveFilesPath() + '/' + filename + '_' + timestamp + '.bak'
    );
  }

  writeFile(
    path,
    data,
    {
      encoding: 'binary'
    },
    err => {
      if (err) {
        callback(err, undefined, undefined);
        return;
      }
      callback(undefined, undefined, true);
    }
  );
}

function saveWeb(
  asZip: boolean,
  filename: string,
  data: any,
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    success: boolean | undefined
  ) => void
) {
  if (asZip) {
    let zip = new JSZip();
    zip.file(filename, data, { binary: true });
    zip
      .generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      })
      .then((content: any) => {
        callback(undefined, 70, undefined);
        // see FileSaver.js
        saveAs(
          content,
          // TODO make sure we only cut of the extension
          // TODO make sure the path is actually stil the filename
          filename.replace('.json', '').replace('.sav', '') + '.zip'
        );
        callback(undefined, undefined, true);
      })
      .catch((error: Error) => {
        callback(error, undefined, undefined);
      });
  } else {
    var element = document.createElement('a');
    var blob = new Blob([Buffer.from(data, 'binary')], {
      type: 'application/octet-stream'
    });
    element.href = window.URL.createObjectURL(blob);
    element.download = filename; // TODO make sure it's the filename
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    callback(undefined, undefined, true);
  }
}
