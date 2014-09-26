var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    stylus      = require('gulp-stylus'),
    nib         = require('nib'),
    jshint      = require('gulp-jshint'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    stylish     = require('jshint-stylish'),
    streamqueue = require('streamqueue'),
    react       = require('gulp-react'),
    exec        = require('child_process').exec,
    //NwBuilder   = require('node-webkit-builder'),
    gutil       = require('gulp-util'),
    Notifier    = new require('node-notifier')();


var bases = {
 root: '.',
 src: 'app/',
 target: 'target/',
 appTarget: 'target/app',
 packageTarget: 'target/package'
};

var paths = {
  all: "**",
  jsx: 'js/**/*.jsx',
  js: 'js/**/*.js',
  styl: "**/*.styl",
  rootStyl: 'index.styl',
  destStyl: 'index.css',
  html: '**/*.html',
  md: '**/*.md'
};

gulp.task('clean-target', function() {
  return gulp.src(bases.target, {read: false})
             .pipe(clean({force: true}));
});

/*gulp.task('npm-install', ['clean-target'], function() {
  return shell.task('npm install --parseable true --color false --unicode false', {cwd : bases.src});
}); */

gulp.task('copy', ['clean-target'], function() {
  return gulp.src(paths.all, {cwd: bases.src})
             .pipe(gulp.dest(bases.appTarget));
});

gulp.task('stylus', ['copy'], function () {
  return gulp.src(paths.rootStyl, {cwd: bases.appTarget})
            .pipe(stylus({errors: true, /*linenos: true,*/ use: [nib()]}))
            /*.pipe(config.production ? minify() : gutil.noop())*/
            .pipe(rename(paths.destStyl))
            .pipe(gulp.dest(bases.appTarget));
});

gulp.task('scripts', ['copy'], function() {
  var stream = streamqueue({objectMode: true});

  // jsx scripts
  stream.queue(gulp.src(paths.js, {cwd: bases.appTarget})
                  .pipe(jshint('./.jshintrc'))
                  .pipe(jshint.reporter(stylish)));


  // jsx scripts
  stream.queue(gulp.src(paths.jsx, {cwd: bases.appTarget})
                  .pipe(react())
                  .pipe(jshint('./.jshintrc'))
                  .pipe(jshint.reporter(stylish)));

  // copy to dest
  return stream.done()
               .pipe(gulp.dest(bases.appTarget));
});

gulp.task('post-build-cleanup', ['stylus', 'scripts'], function() {
  return gulp.src([paths.md, paths.styl, paths.jsx], {read: false, cwd: bases.target})
             .pipe(clean({force: true}));
});

gulp.task('notify', ['post-build-cleanup'], function() {
  Notifier.notify({
        title: 'Build Completed',
        message: 'Refresh the app to see the updates!'
    });
})

gulp.task('watch', ['post-build-cleanup'], function() {
  gutil.log(gutil.colors.cyan('watching for changes...'));
  return gulp.watch([bases.src + paths.all,
                     "!" + bases.src + "node_modules/**"],
                    ['build']);
});

gulp.task('open', ['build'], function (cb) {
  exec('node_modules/.bin/nodewebkit target/app --remote-debugging-port=9222', {
    cwd: paths.root
  }, function (err, stdout, stderr) {
      //upon complete
  });
})


gulp.task('build', ['clean-target', 'copy', 'stylus', 'scripts', 'post-build-cleanup', 'notify']);
gulp.task('default', ['build', 'open']);
gulp.task('dev', ['build', 'watch', 'open']);



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