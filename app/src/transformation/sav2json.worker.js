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
      json = JSON.parse(Buffer.from(message.data.data).toString('utf-8'));
      postMessage({
        status: 'ok',
        data: json
      });
    } else {
      //console.time('sav2json');

      const reader = fileReaderStream(message.data.data);
      reader.pipe(new satisfactory.Sav2JsonTransform())
        .on('data', data => {
          console.log('gotData', data);
          postMessage({
            status: 'ok',
            data: data
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
