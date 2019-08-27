
console.log('hello from a webworker');
/*importScripts(
  ''
);*/
const satisfactory = require('satisfactory-json');
//import { sav2json } from 'satisfactory-json';


/*addEventListener('message', (message) => {
  console.log('in webworker', message);

  postMessage({
    type: 'progress',
    message: 'this is the response ' + message.data
  });
});*/

addEventListener('message', (message) => {
  try {
    console.log('STARTED');
    const json = satisfactory.sav2json(Buffer.from(message.data));
    console.log('FINISHED');
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
});

/*var json;
if (this.importJson) {
  json = JSON.parse(Buffer.from(data).toString('utf-8'));
} else {
  json = sav2json(Buffer.from(data));
}*/