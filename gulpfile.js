'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var clean = require('gulp-clean');
var ugly = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

var fs = require('fs');
var _ = require('lodash');

function getBanner () {
  var data = {
    pkg  : require('./package.json'),
    date : (new Date()).toString()
  };

  return _.template(fs.readFileSync('banner.txt', 'utf8'), data);
}

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(jscs());
});

gulp.task('test', function () {
  var m = mocha({
    require  : require('coffee-script'),
    reporter : 'spec',
    timeout  : 5e4
  });

  return gulp.src(['test/**/*.coffee'])
    .pipe(m);
});

gulp.task('clean', function () {
  return gulp.src('dist/**/*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy', function () {
  return gulp.src('src/is.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('ugly', function () {
  return gulp.src('src/is.js')
    .pipe(ugly({
      preserveComments : 'some',
      report           : 'gzip'
    }))
    .pipe(rename('is.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('bannerize', function () {
  return gulp.src('dist/**/*.js')
    .pipe(header(getBanner()))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'copy', 'ugly'], function () {
  gulp.run('bannerize');
});

gulp.task('default', function () {
  gulp.watch([
    '**/*.js',
    '**/*.coffee'
  ], function () {
    gulp.run('lint', 'test');
  });
});
