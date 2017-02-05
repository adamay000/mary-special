var path = require('path');
var webpack = require('webpack');

var postcssImport = require('postcss-import');
var postcssAutoprefixer = require('autoprefixer');
var postcssCamelCase = require('postcss-camel-case');
var postcssMixins = require('postcss-mixins');
var postcssExtend = require('postcss-extend');
var postcssNestedVars = require('postcss-nested-vars');
var postcssNested = require('postcss-nested');
var postcssLocal = require('postcss-modules-local-by-default');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssColorFunction = require('postcss-color-function');

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    app: [
      './index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: [
          'babel'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader?parser=postcss-comment'
        ]
      }
    ]
  },
  postcss: function() {
    // 順番超大事
    return [
      postcssImport(),
      postcssAutoprefixer,
      postcssCamelCase,
      postcssMixins,
      postcssExtend,
      postcssNestedVars,
      postcssNested,
      postcssLocal,
      postcssSimpleVars,
      postcssColorFunction
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
