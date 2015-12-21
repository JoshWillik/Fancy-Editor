'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var serve = require('gulp-serve');
var stylus = require('gulp-stylus');
var nib = require('nib');

function logError (err) {
  console.log(err.toString());
  this.emit('end')
}

gulp.task('serve', serve('dist'));

gulp.task('css', function () {
  return gulp.src('./src/themes/*.styl')
    .pipe(stylus({
      use: nib(),
      import: ['nib']
    }))
      .on('error', logError)
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('demos', function () {
  return gulp.src('./src/demos/*')
    .pipe(gulp.dest('./dist/demos'))
})

gulp.task('javascript', function () {
  return browserify({
    entries: './src/fancybox.js',
    debug: true,
  })
      .on('error', logError)
    .transform('babelify', {presets: ['es2015']})
    .bundle()
      .on('error', logError)
    .pipe(source('fancybox.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', ['javascript', 'css', 'demos'])

gulp.task('watch', ['default', 'serve'], function () {
  gulp.watch('./src/**/*.js', ['javascript'])
  gulp.watch('./src/themes/*.styl', ['css'])
  gulp.watch('./src/demos/*', ['demos'])
})
