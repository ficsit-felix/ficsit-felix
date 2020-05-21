import { SaveFileReader } from '../core/SaveGameLoading';
export class WebFileReader implements SaveFileReader {
  constructor(private worker: any, private file: File) { }

  readFile(
    filepath: string,
    asJson: boolean,
    progressCallback: (progress: number) => void,
    errorCallback: (error: Error) => void,
    successCallback: (saveGame: import('satisfactory-json').SaveGame) => void
  ): void {
    // put save file data on window object to make it accessible to the BugReportDialog without polluting Vue
    window.data = this.file;


    this.worker.addEventListener('message', (message: any) => {
      if (message.data.status === 'error') {
        errorCallback(new Error(message.data.error));
        return;
      }
      successCallback(message.data.data);
    });

    this.worker.postMessage({
      importJson: asJson,
      data: this.file
    });
  }
}
