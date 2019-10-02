console.log('hello from a webworker');
/*importScripts(
  ''
);*/
const satisfactory = require('satisfactory-json');
const fileReaderStream = require('filereader-stream');
//import { sav2json } from 'satisfactory-json';

/*addEventListener('message', (message) => {
  console.log('in webworker', message);

  postMessage({
    type: 'progress',
    message: 'this is the response ' + message.data
  });
});*/

addEventListener('message', message => {
  try {
    //console.log('STARTED');
    let json;
    if (message.data.importJson) {
      var reader = new FileReader();
      /*reader.onprogress = evt => {
        if (evt.lengthComputable) {
          var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
          this.progress = percentLoaded / 2;
        }
      };*/
      reader.onload = response => {
        try {
          json = JSON.parse(Buffer.from(reader.result).toString('utf-8'));
          postMessage({
            status: 'ok',
            data: json
          });
        } catch (error) {
          console.error(error);
          // TODO pass stack trace
          postMessage({
            status: 'error',
            error: error.message
          });
        }
      };
      reader.readAsArrayBuffer(message.data.data);
    } else {
      //console.time('sav2json');
      const reader = fileReaderStream(message.data.data);
      reader
        .pipe(new satisfactory.Sav2JsonTransform())
        .on('data', data => {
          console.log('gotData', data);
          postMessage({
            status: 'ok',
            data: data
          });
        })
        .on('error', error => {
          postMessage({
            status: 'error',
            error: error.message
          });
        });

      /*satisfactory.sav2json(fileReaderStream(message.data.data)).then(json => {
        
      });*/
      //console.timeEnd('sav2json');
    }
    //console.log('FINISHED');
  } catch (error) {
    console.error(error);
    // TODO pass stack trace
    postMessage({
      status: 'error',
      error: error.message
    });
  }
});

/*var json;
if (this.importJson) {
  json = JSON.parse(Buffer.from(data).toString('utf-8'));
} else {
  json = sav2json(Buffer.from(data));
}*/
