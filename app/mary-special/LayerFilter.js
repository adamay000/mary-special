import * as PIXI from 'pixi.js';

export default class LayerFilter extends PIXI.Filter {

  constructor(images, width, height, margin) {
    super(null, LayerFilter.createFragmentShader(images), LayerFilter.createUniforms(images, width, height, margin));
  }

  parallax(x, y) {
    this.uniforms.x = x;
    this.uniforms.y = y;
  }

  static createFragmentShader(images) {
    return [
      'varying vec2 vTextureCoord;',
      images.map((image, idx) =>
        `uniform sampler2D mapSampler${idx};`
      ).join(''),
      'uniform vec2 ratio;',
      'uniform vec2 offset;',
      'uniform vec2 scrollable;',
      'uniform float x;',
      'uniform float y;',
      'void main(void) {',
      'vec4 color = vec4(0.0);',
      images.map((image, idx) => {
        return (
          `float x${idx} = (vTextureCoord.x) * ratio.x + offset.x + x * (scrollable.x + ${image.strength.toFixed(8)});` +
          `float y${idx} = (vTextureCoord.y) * ratio.y + offset.y + y * (scrollable.y + ${image.strength.toFixed(8)});` +
          `vec4 s${idx} = texture2D(mapSampler${idx}, vec2(x${idx}, y${idx}));` +
          `if (x${idx} < 0.0 || x${idx} > 1.0 || y${idx} < 0.0 || y${idx} > 1.0) {` +
          `s${idx} = vec4(0.0);` +
          '}'
        );
      }).join(''),
      images.map((image, idx) =>
        `color = s${idx} * s${idx}.a + color * (1.0 - s${idx}.a);`
      ).join(''),
      'gl_FragColor = color;',
      '}'
    ].join('');
  }

  static createUniforms(images, width, height, margin) {
    const uniforms = {
      x: {
        type: 'f',
        value: 0
      },
      y: {
        type: 'f',
        value: 0
      },
      ratio: {
        type: '2f',
        value: [
          LayerFilter.getNextPowerTwo(window.innerWidth) / width,
          LayerFilter.getNextPowerTwo(window.innerHeight) / height
        ]
      },
      offset: {
        type: '2f',
        value: [
          0.5 - window.innerWidth * 0.5 / width,
          0.5 - window.innerHeight * 0.5 / height
        ]
      },
      scrollable: {
        type: '2f',
        value: [
          Math.abs(width - window.innerWidth) * 0.5 / width * (1.0 - margin),
          Math.abs(height - window.innerHeight) * 0.5 / height * (1.0 - margin)
        ]
      }
    };
    images.forEach((image, idx) => {
      uniforms[`mapSampler${idx}`] = {
        type: 'sampler2D',
        value: image.texture
      };
    });
    return uniforms;
  }

  static getNextPowerTwo(number) {
    let result = 2;
    while (result < number) {
      result *= 2;
    }
    return result;
  }

}
