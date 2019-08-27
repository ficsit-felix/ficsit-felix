const satisfactory = require('satisfactory-json');

addEventListener('message', message => {
  try {
    let data;
    if (message.data.exportJson) {
      data = JSON.stringify(message.data.data);
    } else {
      console.time('json2sav');
      data = satisfactory.json2sav(message.data.data);
      console.timeEnd('json2sav');
    }
    postMessage({
      status: 'ok',
      data: data
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
