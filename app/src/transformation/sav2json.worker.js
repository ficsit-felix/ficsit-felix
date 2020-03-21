const satisfactory = require('satisfactory-json');
const fileReaderStream = require('filereader-stream');

addEventListener('message', message => {
  try {
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
      const reader = fileReaderStream(message.data.data);
      reader
        .pipe(new satisfactory.Sav2JsonTransform())
        .on('data', data => {
          postMessage({
            status: 'ok',
            data: data
          });
        })
        .on('error', error => {
          console.error('error', error);
          postMessage({
            status: 'error',
            error: error.message
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
