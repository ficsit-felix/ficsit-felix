import * as functions from "firebase-functions";
import * as cors from "cors";
import * as gcs from "@google-cloud/storage";
import { v4 } from "uuid";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const options: cors.CorsOptions = {
  origin: true
};
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
    try {
      // if (process.env.PWD === "/user_code") { // on firebase

      const fileName = this.uuid + ".sav";
      const tempFile = path.join(os.tmpdir(), fileName);

      fs.writeFile(tempFile, this.request.body, err => {
        if (err) {
          this.error(err.message);
          return;
        }
        try {
          // upload to cloud storage
          const bucket = new gcs.Storage().bucket("ficsit-felix.appspot.com");
          bucket
            .upload(tempFile, {
              destination: "reports/" + fileName,
              resumable: false
            })
            .then(() => {
              this.response.send('{"status": "ok"}');
            })
            .catch(e => {
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
  }

  error(message: string) {
    console.trace("error: " + message);
    console.error("uuid: " + this.uuid);
    if (!this.hadError) {
      // we cannot send two error messages
      this.response.send(
        JSON.stringify({
          type: "error",
          uuid: this.uuid,
          text: message
        })
      );
    }
    this.hadError = true;
  }
}

export const reportBug = functions.https.onRequest((request, response) => {
  cors(options)(request, response, () => {
    console.log(request);
    if (request.method !== "POST") {
      response.send("");
      return;
    }
    if (typeof request.body !== "object") {
      // console.log(request);
      const error: Error = {
        type: "error",
        text: "wrong request type: " + typeof request.body
      };
      response.send(JSON.stringify(error));
      return;
    }

    new ReportBug(request, response).upload();
  });
});
