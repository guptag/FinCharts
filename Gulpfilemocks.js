var loadTasks = function (gulp) {

  var clean       = require('gulp-clean'),
      stylus      = require('gulp-stylus'),
      nib         = require('nib'),
      jshint      = require('gulp-jshint'),
      stylish     = require('jshint-stylish'),
      seq         = require('run-sequence'),
      react       = require('gulp-react'),
      exec        = require('child_process').exec,
      gutil       = require('gulp-util'),
      Notifier    = new require('node-notifier')();


  var bases = {
   src: 'mocks/',
   target: 'target/app/mocks/'
  };

  var paths = {
    all: "**",
    jsx: '**/*.jsx',
    js: '**/*.js',
    styl: "**/*.styl",
    md: '**/*.md'
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

  gulp.task('mocks-build-cleanup', ['mocks-stylus', 'mocks-jshint-react'], function() {
    // delete unnecessary files in target
    return gulp.src([paths.md, paths.styl, paths.jsx], {read: false, cwd: bases.target})
                 .pipe(clean({force: true}));
  });

  gulp.task('mocks-notify', ['mocks-build-cleanup'], function() {
      Notifier.notify({
            title: 'FinCharts (Mocks): Build Completed',
            message: 'App will be auto refreshed in a moment...'
        });
  });

  gulp.task('mocks-watch', ['mocks-build-cleanup'], function() {
      gutil.log(gutil.colors.cyan('watching for changes...'));
      return gulp.watch([bases.src + paths.all],
                        ['mocks-build']);
  });

  gulp.task('mocks-open', function (cb) {
      exec('node_modules/.bin/nodewebkit target/app --remote-debugging-port=9222', {
        cwd: paths.root
      }, function (err, stdout, stderr) {
          //upon complete
      });
  });

  gulp.task('mocks-build', ['mocks-copy', 'mocks-stylus', 'mocks-jshint-react', 'mocks-build-cleanup', 'mocks-notify']);
}

module.exports = loadTasks;