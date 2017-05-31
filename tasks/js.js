var gulp = require('gulp');
var gutil = require('gulp-util');
var glob = require('glob');
var path = require('path');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var shimify = require('browserify-shim');
var fs = require('fs');
var factor = require('factor-bundle');
var watchify = require('watchify');
var errorify = require('errorify');

var config = require('../config/config').js;
var browserSync = require('../config/config').browserSync.instance;

var defaults = {
  filesBundles: '/assets/js/*.js',
  filesSource: '/assets/js/**/*.js',
  filesBuild: '/public/js',
  babelPresets: ['es2015', 'react'],
  babelPlugins: ['transform-object-rest-spread']
};

var options = Object.assign({}, defaults, config);

/**
 * Bundle JS
 */
gulp.task('js', function(cb) {
  glob(options.filesBundles, function(er, files) {
    files.forEach(function(file) {
      var basename = path.basename(file);
      browserify(file)
        .exclude('jquery')
        .transform('babelify', {
          presets: options.babelPresets,
          plugins: options.babelPlugins
        })
        .bundle()
        .on('error', function(err){
          gutil.log(err.message);
        })
        .pipe(source(basename))
        .pipe(gulp.dest(options.filesBuild));
    });
    cb(er);
  });
});

/**
 * Bundle Module JS
 */
gulp.task('js-modules', function(cb) {
  glob(options.filesModuleBundles, function(er, files) {

      var b = browserify({
        entries: files,
        cache: {},
        packageCache: {},
        plugin: [watchify]
      })
      // Exclude global libraries
      .exclude('jquery')
      // Babelify settings
      .transform('babelify', {
        presets: options.babelPresets,
        plugins: options.babelPlugins
      })
      // Split common code out.
      .plugin(factor, { outputs: files.map(filePath => {
          return path.join(
            path.resolve(path.dirname(filePath), '../../build/js/'),
            path.basename(filePath)
          );
        })
      })
      .plugin(errorify)
      // Browserify error handler
      .on('error', function(err){
        gutil.log(err.message);
        gutil.beep();
        this.emit('end');
      })
      // Watchify update handler
      .on('update', function(id){
        gutil.log(id);
        bundle();
      })
      // Watchify log handler
      .on('log', function(msg){
        gutil.log(msg);
      });

      // Initial Bundle
      bundle();

      function bundle() {
        b.bundle()
          .pipe(source('common.js'))
          .pipe(gulp.dest(options.filesCommonDir))
          // Update browser-sync
          .pipe(browserSync.stream({once: true}));;
      }
    cb(er);
  });
});


