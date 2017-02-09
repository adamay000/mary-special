import MotionEmitter from './MotionEmitter';
import Loop from './Loop';

export default class Layer {

  constructor($canvas, sprite, width, height, margin, parallaxMagnification, scrollRubber, scrollSpeed) {
    this.$canvas = $canvas;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.parallaxMagnification = parallaxMagnification;
    this.scrollRubber = scrollRubber;
    this.scrollSpeed = scrollSpeed;

    this.scrollableWidth = 0;
    this.scrollableHeight = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.motionX = 0;
    this.motionY = 0;
    this.velocityX = 0;
    this.velocityY = 0;

    this.sprite = sprite;
    this.sprite.scale.set(width / sprite.texture.width, height / sprite.texture.height);
    this.sprite.anchor.set(0.5);

    this.isMoving = false;

    this.resize();
    this.scroll();

    window.addEventListener('resize', () => {
      this.resize();
      this.scroll();
    });

    MotionEmitter.instance.on('update', (motionX, motionY) => {
      this.motionX = motionX;
      this.motionY = motionY;
    });

    Loop.instance.on('every', () => {
      const vectorX = this.motionX - this.currentX;
      const vectorY = this.motionY - this.currentY;
      this.velocityX = this.velocityX * this.scrollRubber + vectorX * (1 - this.scrollRubber);
      this.velocityY = this.velocityY * this.scrollRubber + vectorY * (1 - this.scrollRubber);

      const moveX = this.velocityX * this.scrollSpeed;
      const moveY = this.velocityY * this.scrollSpeed;

      this.currentX += moveX;
      this.currentY += moveY;

      this.scroll();

      this.isMoving = moveX > 0.0001 || moveX < -0.0001 || moveY > 0.0001 || moveY < -0.0001;
    });
  }

  scroll() {
    this.sprite.position.set(
      this.scrollableWidth * (this.currentX * (1 + this.parallaxMagnification)),
      this.scrollableHeight * (this.currentY * (1 + this.parallaxMagnification))
    );
  }

  resize() {
    const rect = this.$canvas.getBoundingClientRect();
    this.scrollableWidth = (this.width - rect.width) / 2 * (1 - this.margin);
    this.scrollableHeight = (this.height - rect.height) / 2 * (1 - this.margin);
  }

}
