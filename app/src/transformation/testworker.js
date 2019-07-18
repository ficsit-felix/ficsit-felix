
console.log('hello from a webworker');

addEventListener('message', (message) => {
  console.log('in webworker', message);

  postMessage({
    type: 'progress',
    message: 'this is the response ' + message.data
  });
});