import { EventEmitter2 } from 'eventemitter2';

export default class Loop extends EventEmitter2 {

  constructor() {
    super();

    this.loopTimer = null;
    this.execute = this.execute.bind(this);
  }

  start() {
    this.execute();
  }

  stop() {
    window.cancelAnimationFrame(this.loopTimer);
  }

  execute() {
    this.loopTimer = window.requestAnimationFrame(this.execute);
    this.emit('every');
  }

}

Loop.instance = new Loop();
