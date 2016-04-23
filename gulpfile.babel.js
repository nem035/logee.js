'use strict';

import path from 'path';

import gulp from 'gulp';
import minifyJS from 'gulp-uglify';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import header from 'gulp-header';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import WebpackDevServer from 'webpack-dev-server';
import pkg from './package.json';

const banner = [
 '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');


// SASS

const sassDir = path.join(__dirname, 'src', 'style', '**', '*.scss');
const jsDir = path.join(__dirname, 'src', 'js', '**', '*.js');

gulp.task('build-sass', () => {
  gutil.log('\n\nBuild SASS Paths: \n', sassDir, '\n\n');
  return gulp.src(sassDir)
    .pipe(gulpSass({outputStyle: 'expanded'}).on('error', gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg } ))
    .pipe(concat('logee.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify-sass', () => {
  gutil.log('\n\nBuild SASS Paths: \n', sassDir, '\n\n');

 return gulp.src(sassDir)
    .pipe(gulpSass({outputStyle: 'compressed'}).on('error', gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg } ))
    .pipe(concat('logee.min.css'))
    .pipe(gulp.dest('./dist'));
});


// JS

gulp.task('build-js', () => {
const logeeDir = './src/js/logee.js';

  gutil.log('\n\nBuild JavaScript Paths: \n', logeeDir, '\n\n');

  const bundler = browserify('./src/js/logee.js');
  bundler.transform(babelify);

  return bundler.bundle()
    .on('error', err => console.error(err))
    .pipe(source('logee.js'))
    .pipe(buffer())
    .pipe(header(banner, { pkg } ))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', () => {
  const logeeDir = './src/js/logee.js';

  gutil.log('\n\nBuild JavaScript Paths: \n', logeeDir, '\n\n');
  
  const bundler = browserify(logeeDir);
  bundler.transform(babelify);

  return bundler.bundle()
    .on('error', err => console.error(err))
    .pipe(source('logee.min.js'))
    .pipe(buffer())
    .pipe(minifyJS())
    .pipe(header(banner, { pkg } ))
    .pipe(gulp.dest('dist'));
});

// COMPILE

gulp.task('compile-sass', ['build-sass', 'minify-sass']);
gulp.task('compile-js', ['build-js', 'minify-js']);
gulp.task('compile', ['compile-sass', 'compile-js']);

// DEV

gulp.task('dev-build-sass', () => {
  return gulp.src(sassDir)
   .pipe(gulpSass({outputStyle: 'expanded'}).on('error', gulpSass.logError))
   .pipe(concat('dev-build.css'))
   .pipe(autoprefixer())
   .pipe(gulp.dest('./dist'));
});

gulp.task('dev-build-js', () => {
  return gulp.src(jsDir)
    .pipe(babel({ presets: ['es2015']}))
    .pipe(concat('dev-build.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev-build', ['dev-build-sass', 'dev-build-js']);

// WATCHERS

gulp.task('watch-sass', function() {
  gulp.watch(sassDir, ['dev-build-sass', 'compile-sass']);
});

gulp.task('watch-js', function() {
  gulp.watch(jsDir, ['compile-js']);
});

// WEBPACK

gulp.task('webpack', ['dev-build-sass'], function(callback) {

  const myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ];

  // run webpack
  let called = false;
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));

    // make sure the callback is only run once 
    // so we don't run into issues on hot realoading
    if (!called) {
      callback();
      called = true;
    } else {
      console.log('Reloaded');
    }
    
  });
});

gulp.task('server', ['webpack'], function(callback) {

  // modify some webpack config options
  const myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});


gulp.task('default', ['server', 'watch-sass', 'watch-js', 'compile']);
