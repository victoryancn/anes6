import path from 'path';
import webpack from 'webpack';
import merge from 'lodash.merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const DEBUG = !process.argv.includes('production');
const VERBOSE = process.argv.includes('verbose');
const WATCH = global.watch;

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1'
];

const outputPath = path.join(__dirname, '../build');
const config = {
  output: {
    path: outputPath,
    publicPath: '',
    sourcePrefix: ' '
  },
  cache: true,
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      '__DEV__': DEBUG
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      hash: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?stage=1',
        exclude: [/node_modules/]
      }, {
        test: /\.html$/,
        loader: 'raw'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }, {
        test: /\.scss$/,
        loaders: [
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({addDependencyTo: bundler}),
      require('precss')(),
      require('autoprefixer')({
        browsers: AUTOPREFIXER_BROWSERS
      })
    ];
  }
};

const appConfig = merge({}, config, {
  output: {
    filename: 'app.js',
    path: outputPath
  },
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    ...config.plugins,
    ...(DEBUG ? [] : [
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE
        }
      })
    ]),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : [])
  ]
});
export default appConfig;
