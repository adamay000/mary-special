var fs = require('fs');
var browserSync = require('browser-sync');
var webpack = require('webpack');
var config = require('./webpack.config.development');
var PORT = process.env.PORT || (process.env.PORT = 8901);

config.plugins.push({
  apply: function liveReloadPlugin(compiler) {
    compiler.plugin('done', browserSync.reload);
  }
});
var compiler = webpack(config);

browserSync({
  notify: false,
  port: PORT,
  open: false,
  reloadOnRestart: true,
  server: {
    baseDir: ['app']
  },
  middleware: [
    require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: true,
        chunks: false,
        modules: false,
        reasons: true,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: false
      }
    })
  ]
});
