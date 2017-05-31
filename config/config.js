var browserSync = require('browser-sync');
var path = require('path');

var siteRoot = '../panibal.dev/';
var themeDir = path.join(siteRoot, 'wp-content/themes/panibal');
var modulesDir = path.join(siteRoot, '/modules/custom');
var sourceDir = path.join(themeDir, '/src');
var buildDir = path.join(themeDir, '/build');
var incPaths = [
  './node_modules/breakpoint-sass/stylesheets'
];

module.exports = {
  css: {
    input: sourceDir + '/scss/**/*.scss',
    output: buildDir + '/css',
    sourcemapsDir: '.',
    options: {
      errLogToConsole: true,
      includePaths: incPaths
    }
  },
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  },
  watch: {
    css: [sourceDir + '/scss/**/*.scss'],
    js: sourceDir + '/js/**/*.{js,jsx}'
  },
  browserSync: {
    instance: browserSync.create(),
    proxy: process.env.BSPROXY || 'panibal.dev:8080',
    files: [
      themeDir + '/**/*.{js,css}'
    ],
    reloadDebounce: 2000
  },
  js: {
    filesBundles: sourceDir + '/js/*.js',
    filesModuleBundles: modulesDir + '/**/src/js/*.js',
    filesSource: sourceDir + '/js/**/*.js',
    filesBuild: buildDir + '/js',
    filesCommonDir: buildDir + '/js',
    babelPresets: [
      './node_modules/babel-preset-es2015',
      './node_modules/babel-preset-react'
    ],
    babelPlugins: []
  }
};
