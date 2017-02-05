import { EventEmitter2 } from 'eventemitter2';

export default class MotionEmitter extends EventEmitter2 {

  constructor() {
    super();

    window.addEventListener('mousemove', this.onMousemove.bind(this));
  }

  onMousemove(event) {
    const motionX = (event.pageX * 2 - window.innerWidth) / (window.innerWidth);
    const motionY = (event.pageY * 2 - window.innerHeight) / (window.innerHeight);
    this.emit('update', motionX, motionY);
  }

}

MotionEmitter.instance = new MotionEmitter();
