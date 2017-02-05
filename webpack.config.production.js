var assign = require('object-assign');
var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = assign({}, baseConfig);
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
);

module.exports = config;
