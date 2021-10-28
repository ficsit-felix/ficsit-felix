//@ts-ignore
import fileReaderStream from 'filereader-stream';
import { Sav2JsonTransform, SaveGame } from 'satisfactory-json';
import { SaveFileReader } from '../core/SaveGameLoading';

export class WebFileReader implements SaveFileReader {
  constructor(private file: File) {}

  readFile(
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: (saveGame: SaveGame) => void
  ): void {
    // put save file data on window object to make it accessible to the BugReportDialog without polluting Vue
    window.data = this.file;

    try {
      let json;
      if (asJson) {
        const reader = new FileReader();
        /*reader.onprogress = evt => {
          if (evt.lengthComputable) {
            const percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            progressCallback(percentLoaded / 2);
          }
        };*/
        reader.onload = response => {
          try {
            json = JSON.parse(
              Buffer.from(reader.result as string).toString('utf-8')
            );
            successCallback(json);
          } catch (error) {
            console.error(error);
            // TODO pass stack trace
            errorCallback(error as Error);
          }
        };
        reader.readAsArrayBuffer(this.file);
      } else {
        console.time('sav2json');
        const reader = fileReaderStream(this.file);
        reader
          .pipe(new Sav2JsonTransform())
          .on('data', (data: any) => {
            console.timeEnd('sav2json');
            successCallback(data);
          })
          .on('progress', (progress: number) => {
            progressCallback(progress);
          })
          .on('error', (error: any) => {
            console.error('error', error);
            errorCallback(error);
          });
      }
    } catch (error) {
      console.error(error);
      // TODO pass stack trace
      errorCallback(error as Error);
    }
  }
}
