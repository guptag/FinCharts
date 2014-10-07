var loadTasks = function (gulp) {

  var source      = require('vinyl-source-stream'),
      clean       = require('gulp-clean'),
      stylus      = require('gulp-stylus'),
      nib         = require('nib'),
      stream      = require('gulp-streamify'),
      jshint      = require('gulp-jshint'),
      rename      = require('gulp-rename'),
      concat      = require('gulp-concat'),
      stylish     = require('jshint-stylish'),
      preprocess  = require('gulp-preprocess'),
      minifyCSS   = require('gulp-minify-css'),
      browserify  = require('browserify'),
      watchify    = require('watchify');
      uglify      = require('gulp-uglify')
      seq         = require('run-sequence'),
      react       = require('gulp-react'),
      reactify    = require('reactify');
      exec        = require('child_process').exec,
      NwBuilder   = require('node-webkit-builder'),
      gutil       = require('gulp-util'),
      streamqueue = require('streamqueue'),
      Notifier    = new require('node-notifier')();


  var bases = {
   src: 'mocks/',
   target: 'target/app/mocks/'
  };

  var paths = {
    all: "**",
    jsx: '**/*.jsx',
    js: '**/*.js',
    styl: "**/*.styl"
  };


  gulp.task('mocks-copy', function() {
    return gulp.src(paths.all, {cwd: bases.src})
               .pipe(gulp.dest(bases.target));
  });

  gulp.task('mocks-stylus', ['mocks-copy'], function () {
    return gulp.src(paths.styl, {cwd: bases.target})
              .pipe(stylus({errors: true, /*linenos: true,*/ use: [nib()]}))
              .pipe(gulp.dest(bases.target));
  });

  gulp.task('mocks-jshint-react', ['mocks-copy'], function () {
  return gulp.src([paths.js, paths.jsx], {cwd: bases.target})
            .pipe(react())
            .pipe(jshint('./.jshintrc'))
            .pipe(jshint.reporter(stylish))
            .pipe(gulp.dest(bases.target));
});

  //gulp.task('mocks-gen', ['mocks-copy', 'mocks-stylus', 'mocks-jshint-react', 'mocks-build-cleanup', 'mocks-notify']);

  gulp.task('mocks-gen', ['mocks-copy', 'mocks-stylus', 'mocks-jshint-react']);
}

console.log(loadTasks);

module.exports = loadTasks;