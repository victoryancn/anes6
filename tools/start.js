import browserSync from 'browser-sync';
import webpack from 'webpack';
import hygienistMiddleware from 'hygienist-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

global.watch = true;
const webpackConfig = require('./webpack.config');
const bundler = webpack(webpackConfig);
export default async () => {
  await require('./build')();
  browserSync({
    server: {
      baseDir: 'build',
      middleware: [
        hygienistMiddleware('build'),
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: webpackConfig.stats,
        }),
        webpackHotMiddleware(bundler),
      ],
    },
    files: [
      'build/**/*.css',
      'build/**/*.html',
    ],
  });
};
