var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    stylus      = require('gulp-stylus'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    stylish     = require('jshint-stylish'),
    streamqueue = require('streamqueue'),
    react       = require('gulp-react'),
    NwBuilder   = require('node-webkit-builder'),
    gutil       = require('gulp-util'),
    Notifier    = require('node-notifier')();


var bases = {
 src: 'app/',
 target: 'target/',
};

var paths = {
  all: "**",
  jsx: '**/*.jsx',
  js: '**/*.js',
  stylus: '**/*.styl',
  html: '**/*.html',
  md: '**/*.md'
};

gulp.task('clean-target', function() {
  return gulp.src(bases.target, {read: false})
             .pipe(clean({force: true}));
});

gulp.task('copy', ['clean-target'], function() {
  return gulp.src(paths.all, {cwd: bases.src})
      .pipe(gulp.dest(bases.target));
});

gulp.task('stylus', ['copy'], function () {
  return gulp.src(paths.stylus, {cwd: bases.target})
    .pipe(stylus({errors: true}))
    .pipe(gulp.dest(bases.target));
});

gulp.task('scripts', ['copy'], function() {
  var stream = streamqueue({objectMode: true});

  // jsx scripts
  stream.queue(gulp.src(paths.jsx, {cwd: bases.target})
                  .pipe(react())
                  .pipe(jshint('./.jshintrc'))
                  .pipe(jshint.reporter(stylish)));

  // copy to dest
  return stream.done()
              .pipe(gulp.dest(bases.target));
});

gulp.task('clean-templates', ['stylus', 'scripts'], function() {
  return gulp.src([paths.md, paths.stylus, paths.jsx], {read: false, cwd: bases.target})
             .pipe(clean({force: true}));
});

gulp.task('watch', function() {
  gulp.watch([bases.src + paths.jsx,
              bases.src + paths.js,
              bases.src + paths.stylus,
              bases.src + paths.html], ['default']);
});


gulp.task('default', ['clean-target', 'copy', 'stylus', 'scripts', 'clean-templates']);




// https://github.com/mllrsohn/node-webkit-builder
/*gulp.task('nw', function () {

    var nw = new NwBuilder({
        version: '0.10.4',
        files: [ './**'],
        platforms: ['osx']
    });

    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

     // return promise
    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});*/