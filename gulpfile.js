// GULPFILE INSPIRED FROM:
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

// MIGHT BE INTERESTING TO LOOK AT AS WELL
// http://lincolnloop.com/blog/speedy-browserifying-multiple-bundles/

// TODO: When in production, use '.min.js'

var gulp = require('gulp');
var es6transpiler = require('gulp-es6-transpiler');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var path = require('path');

var production = process.env.NODE_ENV === 'production';

function bundleWithOpts(opts) {
  console.log(opts);
  var src = opts.src || null;
  var dest = opts.dest;
  var watch = opts.watch || true;
  var requires = opts.requires || [];
  var externals = opts.externals || [];
  var production = opts.production || false;
  if (!src && requires.length == 0) {
    throw "You must specify either a .src or an array in .requires"
  }
  var destDirname = path.dirname(dest);
  var destBasename = path.basename(dest);
  var bundler, rebundle;
  bundler = browserify(src, {
    basedir: __dirname, 
    debug: !production, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });

  // Mark anything in externals as external so that it won't be compiled into
  // the bundle.
  externals.forEach(function (lib) {
    bundler.external(lib);
  });

  // Force a require
  requires.forEach(function (lib) {
    bundler.require(lib);
  })

  function log(msg) {
    console.log(src + ': ' + msg);
  }
 
  if(watch) {
    bundler = watchify(bundler) 
    bundler.on('log', log);
  }
 
  bundler.transform([reactify, {'es6': true}]);

  rebundle = function() {
    var stream = bundler.bundle();
    // outputs error message to the console.
    stream.on('error', log);
    stream = stream.pipe(source(destBasename));
    if (production) {
      stream = stream.pipe(streamify(uglify()));
    }
    return stream.pipe(gulp.dest(destDirname));
  };
 
  bundler.on('update', rebundle);

  return rebundle();
}

function bundleScripts(src, dest, libs) {
  bundleWithOpts({
    src: src,
    dest: dest,
    watch: true,
    externals: libs
  });
}

function bundleLibs(libs) {
  bundleWithOpts({
    dest: './js/build/bundle-lib.js',
    requires: libs
  });
}

function bundle(src, dest, libs) {
  bundleScripts(src, dest, libs);
  bundleLibs(libs);
}

var libs = [
  'jquery',
  'jquery-ui/sortable',
  'react',
  'lodash',
  'reflux',
  'immutable'
];

var reactBundle = require('gulp-react-bundle');

gulp.task('default', function() {
  // bundle('./js/index.js', './js/build/bundle.js', libs);
  reactBundle('./js/app/app.js', './js/build/app.js');
});

gulp.task('build', function () {
  var react = require('gulp-react');
  gulp.src('./js/lib/modal.js')
    .pipe(react())
    .pipe(es6transpiler())
    .pipe(gulp.dest('./dist'));
  gulp.src('./js/lib/modal-mixin.js')
    .pipe(gulp.dest('./dist'));
});