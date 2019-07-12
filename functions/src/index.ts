import * as functions from 'firebase-functions';
//import * as cors from 'cors';
import * as gcs from '@google-cloud/storage';
import { v4 } from 'uuid';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
//import { inspect } from 'util';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
/*const options: cors.CorsOptions = {
  origin: true,
};*/
interface Error {
  type: string;
  text: string;
}

class ReportBug {
  request: functions.Request;
  response: functions.Response;
  uuid: string;
  hadError = false;

  constructor(request: functions.Request, response: functions.Response) {
    this.request = request;
    this.response = response;
    this.uuid = v4();
  }
  upload() {
    return new Promise((resolve, reject) => {


      try {
        // if (process.env.PWD === "/user_code") { // on firebase
        const now = new Date();
        function leadingZeros(n: number): string {
          if (n <= 9) {
            return '0' + n;
          }
          return n.toString();
        }
        const formattedDate = now.getFullYear() + '-' + leadingZeros(now.getMonth() + 1) + '-' + leadingZeros(now.getDate()) + '_' + leadingZeros(now.getHours()) + '-' + leadingZeros(now.getMinutes()) + '-' + leadingZeros(now.getSeconds());

        const fileName = formattedDate + '_' + this.request.query.uuid + '.zip';
        const tempFile = path.join(os.tmpdir(), fileName);

        const base64 = Buffer.from(this.request.body, 'base64').toString('utf8');
        const content = Buffer.from(base64, 'base64');

        fs.writeFile(tempFile, content, err => {
          if (err) {
            this.error(err.message);
            return;
          }
          this.response.send('{"status": "ok"}');
          console.log(tempFile);

          resolve();
          return;

          try {
            // upload to cloud storage
            const bucket = new gcs.Storage().bucket('ficsit-felix.appspot.com');
            bucket
              .upload(tempFile, {
                destination: 'reports/' + fileName,
                resumable: false
              })
              .then(() => {
                console.log('Successful');
                this.response.send('{"status": "ok"}');
              })
              .catch(e => {
                console.error(e);
                this.error(e);
              });
          } catch (e) {
            console.error(e.stack);
            this.error(e.message);
          }
        });



        //}
      } catch (e) {
        console.error(e.stack);
        this.error(e.message);
      }
    });
  }

  error(message: string) {
    console.trace('error: ' + message);
    console.error('uuid: ' + this.uuid);
    if (!this.hadError) {
      // we cannot send two error messages
      this.response.send(
        JSON.stringify({
          type: 'error',
          uuid: this.uuid,
          text: message
        })
      );
    }
    this.hadError = true;
  }
}

export const reportBug = functions.https.onRequest((request, response) => {
  response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  if (request.method === 'OPTIONS') { // CORS preflight

    response.send();
    return;
  }
  //  cors(options)(request, response, () => {
  if (request.method !== 'POST') {
    console.log('wrong request: ' + request.method);
    const error: Error = {
      type: 'error',
      text: 'wrong request method: ' + request.method
    };
    response.send(JSON.stringify(error));
    return;
  }
  if (typeof request.body !== 'object') {
    // console.log(request);
    const error: Error = {
      type: 'error',
      text: 'wrong request body type: ' + typeof request.body
    };
    response.send(JSON.stringify(error));
    return;
  }

  return new ReportBug(request, response).upload();
  //});
});
