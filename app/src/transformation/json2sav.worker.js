const satisfactory = require('satisfactory-json');

let window = self;
const streamSaver = require('streamsaver');

addEventListener('message', message => {
  try {
    let data;
    if (message.data.exportJson) {
      data = JSON.stringify(message.data.data);
    } else {
      const transform = new satisfactory.Json2SavTransform();
      const fileStream = streamSaver.createWriteStream('filename.txt');
      transform.pipe(fileStream);
      console.time('json2sav');
      transform.write(message.data.data);
      transform.on('end', () => {
        console.timeEnd('json2sav');
        postMessage({
          status: 'ok',
          data: data
        });
      });
    }
  } catch (error) {
    console.error(error);
    // TODO pass stack trace
    postMessage({
      status: 'error',
      error: error.message
    });
  }
});
