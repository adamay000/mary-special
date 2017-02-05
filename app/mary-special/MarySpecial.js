import * as PIXI from 'pixi.js';
import Loop from './Loop';
import Renderer from './Renderer';
import Layer from './Layer';

export default class MarySpecial {

  constructor(params) {
    this.$canvas = params.$canvas;
    this.width = params.width;
    this.height = params.height;
    this.margin = params.margin;
    this.scrollRubber = params.scrollRubber;
    this.scrollSpeed = params.scrollSpeed;

    this.renderer = new Renderer(params.$canvas);
    this.layers = [];

    Loop.instance.on('every', () => {
      this.renderer.render();
    });
    Loop.instance.start();

    if (params.images) {
      this.initialize(params.images);
    }
  }

  addImage(imagePath, parallaxMagnification, scrollRubber, scrollSpeed) {
    const layer = new Layer(
      this.$canvas,
      new PIXI.Sprite(PIXI.Texture.fromImage(imagePath)),
      this.width,
      this.height,
      this.margin,
      parallaxMagnification,
      scrollRubber,
      scrollSpeed
    );
    this.layers.push(layer);
    this.renderer.add(layer.sprite);
  }

  preload(images, onComplete) {
    const loader = new PIXI.loaders.Loader();
    images.forEach(image => loader.add(image));
    loader.load(onComplete);
  }

  initialize(images) {
    this.preload(images.map(image => image.path), () => {
      images.forEach(image => this.addImage(image.path, image.strength, image.rubber, image.speed));
    });
  }

}
