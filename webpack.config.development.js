var assign = require('object-assign');
var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = assign({}, baseConfig);
config.devtool = 'inline-source-map';
config.cache = true;
config.resolve.extensions.unshift('.development.js');
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development')
}));

module.exports = config;
