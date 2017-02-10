import * as PIXI from 'pixi.js';
import Loop from './Loop';
import Renderer from './Renderer';
import Layer from './Layer';

export default class MarySpecial {

  constructor(params) {
    this.$canvas = params.$canvas;
    this.width = params.width;

    this.renderer = new Renderer(params.$canvas);
    this.layer = new Layer(
      params.$canvas,
      params.width,
      params.height,
      params.margin,
      params.scrollPower,
      params.scrollSpeed
    );
    this.renderer.add(this.layer.container);

    Loop.instance.on('every', () => {
      this.renderer.render();
    });
    Loop.instance.start();

    if (params.images) {
      this.initialize(params.images);
    }
  }

  preload(images, onComplete) {
    const loader = new PIXI.loaders.Loader();
    images.forEach(image => loader.add(image));
    loader.load(onComplete);
  }

  initialize(images) {
    this.preload(images.map(image => image.path), () => {
      this.layer.initialize(images.map(image => ({
        texture: PIXI.Texture.fromImage(image.path),
        strength: image.strength
      })));
    });
  }

}
