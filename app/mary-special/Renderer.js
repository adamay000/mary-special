import * as PIXI from 'pixi.js';

export default class Renderer {

  constructor($canvas) {
    this.renderer = PIXI.autoDetectRenderer(100, 100, {
      view: $canvas,
      transparent: true
    });
    this.stage = new PIXI.Container();
    this.centerize = new PIXI.Container();
    this.stage.addChild(this.centerize);

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  add(obj) {
    this.centerize.addChild(obj);
  }

  remove(obj) {
    this.centerize.removeChild(obj);
  }

  render() {
    this.renderer.render(this.stage);
  }

  resize() {
    const width = this.renderer.view.getBoundingClientRect().width;
    const height = this.renderer.view.getBoundingClientRect().height;
    this.renderer.resize(width, height);
    this.centerize.setTransform(width / 2, height / 2);
  }

}
