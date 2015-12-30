'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const serve = require('gulp-serve');
const stylus = require('gulp-stylus');
const nib = require('nib');
const glob = require('glob')
const es = require('event-stream')

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

gulp.task('javascript', function (done) {
  glob('src/{fancybox,tests/**}.js', (err, files) => {
    let tasks = files.map(file => {
      return browserify([file], {
        debug: true,
      })
          .on('error', logError)
        .transform('babelify', {presets: ['es2015']})
        .bundle()
          .on('error', logError)
        .pipe(source(file.split('/').slice(1).join('/')))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
          // .pipe(uglify())
          .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('default', ['javascript', 'css', 'demos'])

gulp.task('watch', ['default', 'serve'], function () {
  gulp.watch('./src/**/*.js', ['javascript'])
  gulp.watch('./src/themes/*.styl', ['css'])
  gulp.watch('./src/demos/*', ['demos'])
})
