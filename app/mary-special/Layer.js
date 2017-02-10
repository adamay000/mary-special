import * as PIXI from 'pixi.js';
import MotionEmitter from './MotionEmitter';
import Loop from './Loop';
import LayerFilter from './LayerFilter';

export default class Layer {

  constructor($canvas, width, height, margin, scrollPower, scrollSpeed) {
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.scrollPower = scrollPower;
    this.scrollSpeed = scrollSpeed;

    this.container = new PIXI.Graphics();
    this.container.filterArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

    const rect = $canvas.getBoundingClientRect();
    this.scrollableWidth = (width - rect.width) / 2 * (1 - this.margin);
    this.scrollableHeight = (height - rect.height) / 2 * (1 - this.margin);
    this.currentX = 0;
    this.currentY = 0;
    this.motionX = 0;
    this.motionY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  initialize(images) {
    this.filter = new LayerFilter(images, this.width, this.height, this.margin);
    this.container.filters = [this.filter];

    MotionEmitter.instance.on('update', (motionX, motionY) => {
      this.motionX = motionX;
      this.motionY = motionY;
    });

    Loop.instance.on('every', () => {
      const vectorX = this.motionX - this.currentX;
      const vectorY = this.motionY - this.currentY;
      this.velocityX = this.velocityX * this.scrollPower + vectorX * (1 - this.scrollPower);
      this.velocityY = this.velocityY * this.scrollPower + vectorY * (1 - this.scrollPower);

      const moveX = this.velocityX * this.scrollSpeed;
      const moveY = this.velocityY * this.scrollSpeed;

      this.isMoving = moveX > 0.0001 || moveX < -0.0001 || moveY > 0.0001 || moveY < -0.0001;
      if (this.isMoving) {
        this.currentX += moveX;
        this.currentY += moveY;

        this.scroll(this.currentX, this.currentY);
      }
    });
  }

  scroll(x, y) {
    this.filter.parallax(x, y);
  }

}
