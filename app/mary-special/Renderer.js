import * as PIXI from 'pixi.js';

export default class Renderer {

  constructor($canvas) {
    this.renderer = PIXI.autoDetectRenderer(100, 100, {
      view: $canvas,
      transparent: true
    });
    this.stage = new PIXI.Container();

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  add(obj) {
    this.stage.addChild(obj);
  }

  remove(obj) {
    this.stage.removeChild(obj);
  }

  render() {
    this.renderer.render(this.stage);
  }

  resize() {
    const width = this.renderer.view.getBoundingClientRect().width;
    const height = this.renderer.view.getBoundingClientRect().height;
    this.renderer.resize(width, height);
  }

}
