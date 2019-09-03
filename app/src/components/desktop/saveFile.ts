import { SaveGame } from 'satisfactory-json';
import Json2SavWorker from 'worker-loader?name=[name].js!@/transformation/json2sav.worker.js';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function saveFileToFilesystem(
  saveGame: SaveGame,
  path: string,
  asJson: boolean,
  asZip: boolean,
  callback: (
    err: Error | undefined,
    progress: number | undefined,
    success: boolean | undefined
  ) => void
) {
  // web version
  const worker = new Json2SavWorker();

  worker.addEventListener('message', message => {
    if (message.data.status === 'error') {
      callback(message.data.error, undefined, undefined);
      return;
    }
    const data = message.data.data;

    callback(undefined, 50, undefined);

    if (asZip) {
      let zip = new JSZip();

      zip.file(path, data, { binary: true });

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
            path.replace('.json', '').replace('.sav', '') + '.zip'
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
      element.download = path; // TODO make sure it's the filename

      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
      callback(undefined, undefined, true);
    }
  });

  worker.postMessage({
    exportJson: asJson,
    data: window.data
  });
}
