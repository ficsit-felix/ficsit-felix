
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
  console.log('in webworker', message);
  const json = satisfactory.sav2json(Buffer.from(message.data));
  postMessage(json);
});

/*var json;
if (this.importJson) {
  json = JSON.parse(Buffer.from(data).toString('utf-8'));
} else {
  json = sav2json(Buffer.from(data));
}*/