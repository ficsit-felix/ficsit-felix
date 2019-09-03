declare module 'worker-loader?name=[name].js!*' {
  export default class WebpackWorker extends Worker {
    constructor();
  }
}
