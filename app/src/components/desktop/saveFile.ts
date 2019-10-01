import { SaveGame } from 'satisfactory-json';
import Json2SavWorker from 'worker-loader?name=[name].js!@/transformation/json2sav.worker.js';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { isElectron } from '@/ts/isElectron';
import { writeFile, fstat, existsSync, copyFileSync } from 'fs';
import { parse } from 'path';
import path from 'path';
import streamSaver from 'streamsaver';
import { Json2SavTransform } from 'satisfactory-json';
import { Writable } from 'stream';

export function saveFileToFilesystem(
  saveGame: SaveGame,
  path: string,
  asJson: boolean,
  asZip: boolean,
  callback: (err?: Error, progress?: number, success?: boolean) => void
) {
  transformFile(saveGame, callback, asZip, path, asJson);
}

class FileWriter extends Writable {
  private writer: any;

  constructor(writer: any) {
    super();
    this.writer = writer;
  }

  _write(
    chunk: any,
    encoding: string,
    callback: (error?: Error | null) => void
  ): void {
    this.writer.write(chunk).then((err: string) => {
      callback();
    });
  }

  _final(callback: (error?: Error | null) => void): void {
    this.writer.close();
    callback();
  }
}

function transformFile(
  saveGame: SaveGame,
  callback: (err?: Error, progress?: number, success?: boolean) => void,
  asZip: boolean,
  path: string,
  asJson: boolean
) {
  const transform = new Json2SavTransform();
  const fileStream = streamSaver.createWriteStream(path);
  const writer = fileStream.getWriter();
  window.onunload = () => writer.abort();
  transform.pipe(new FileWriter(writer)).on('finish', () => {
    callback(undefined, undefined, true);
  });
  /*  transform.on('data', chunk => {
      console.log('data', chunk)
      writer.write(chunk);
    })
    transform
      .on('end', () => {
        writer.close();
        console.timeEnd('json2sav');
        console.log('finished');
      });*/

  console.time('json2sav');
  transform.write(saveGame);
  transform.end();

  /*  const worker = new Json2SavWorker();
    worker.addEventListener('message', message => {
      if (message.data.status === 'error') {
        callback(new Error(message.data.error), undefined, undefined);
        return;
      }
      const data = message.data.data;
      callback(undefined, 50, undefined);
      if (isElectron()) {
        // desktop version
  
        // TODO convert to zip
  
        saveDesktop(path, data, callback);
      } else {
        // web version
        saveWeb(asZip, path, data, callback);
      }
    });
    worker.postMessage({
      exportJson: asJson,
      data: saveGame
    });*/
}

function saveDesktop(
  filePath: string,
  data: any,
  callback: (err?: Error, progress?: number, success?: boolean) => void
) {
  if (existsSync(filePath)) {
    // make a backup
    // TODO maybe zip the backup?
    const timestamp = new Date()
      .toISOString()
      .replace('T', '_')
      .replace('Z', '')
      .replace(/:/g, '_');

    const parsedPath = parse(filePath);
    copyFileSync(
      filePath,
      path.join(parsedPath.dir, parsedPath.base + '_' + timestamp + '.bak')
    );
  }

  writeFile(
    filePath,
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
  path: string,
  data: any,
  callback: (err?: Error, progress?: number, success?: boolean) => void
) {
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
}
