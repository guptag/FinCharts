var gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
    clean       = require('gulp-clean'),
    stylus      = require('gulp-stylus'),
    nib         = require('nib'),
    jshint      = require('gulp-jshint'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    stylish     = require('jshint-stylish'),
    preprocess  = require('gulp-preprocess'),
    minifyCSS   = require('gulp-minify-css'),
    browserify  = require('browserify');
    uglify      = require('gulp-uglify')
    seq         = require('run-sequence'),
    streamqueue = require('streamqueue'),
    react       = require('gulp-react'),
    reactify    = require('reactify');
    exec        = require('child_process').exec,
    NwBuilder   = require('node-webkit-builder'),
    gutil       = require('gulp-util'),
    Notifier    = new require('node-notifier')();


var bases = {
 root: '.',
 src: 'app/',
 target: 'target/',
 appTarget: 'target/app/',
 packageTarget: 'target/package/'
};

var paths = {
  all: "**",
  jsx: 'js/**/*.jsx',
  js: 'js/**/*.js',
  styl: "css/**/*.styl",
  rootStyl: 'css/index.styl',
  destStyl: 'css/index.css',
  rootJS: 'js/index.js',
  rootHtml: 'index.html',
  html: '**/*.html',
  md: '**/*.md',
  css: 'css/*/**'
};

var isDevEnvironment = false;

gulp.task('setDevEnv', function() {
    isDevEnvironment = true;
});

gulp.task('clean-target', function() {
  return gulp.src(bases.target, {read: false})
             .pipe(clean({force: true}));
});

gulp.task('copy', function() {
  return gulp.src(paths.all, {cwd: bases.src})
             .pipe(gulp.dest(bases.appTarget));
});

gulp.task('stylus', ['copy'], function () {
  return gulp.src(paths.rootStyl, {cwd: bases.appTarget})
            .pipe(stylus({errors: true, /*linenos: true,*/ use: [nib()]}))
            .pipe(isDevEnvironment ? gutil.noop() : minifyCSS({keepBreaks:true}))
            .pipe(rename(paths.destStyl))
            .pipe(gulp.dest(bases.appTarget));
});

gulp.task('scripts', ['copy'], function() {
  //var stream = streamqueue({objectMode: true});
  //var stream2 = streamqueue({objectMode: true});

  // js, jsx scripts
  /*stream.queue(gulp.src([paths.js, paths.jsx, paths.rootJS], {cwd: bases.appTarget})
                  .pipe(react())
                  .pipe(jshint('./.jshintrc'))
                  .pipe(jshint.reporter(stylish)))
                  .pipe(isDevEnvironment ? gutil.noop() : uglify());

  // copy to dest
  return stream.done()
               .pipe(gulp.dest(bases.appTarget + "/js"));*/

  return browserify({
                      entries: ['./app/index.js'],
                      extensions: ['.jsx', '.js'],
                      paths: ['./app/node_modules','./app/js/'],
                      noparse: ['q', 'lodash', 'react', 'flux', 'moment']
                  })
                .transform(reactify)
                .bundle({ debug: isDevEnvironment })
                .pipe(source('client.js'))
                .pipe(gulp.dest(bases.appTarget));
});

gulp.task('post-build-cleanup', ['stylus', 'scripts'], function() {
  // delete unnecessary files in target
  return gulp.src([paths.md, paths.styl, paths.jsx, paths.css], {read: false, cwd: bases.appTarget})
             .pipe(clean({force: true}));
});

gulp.task('post-process-files', ['post-build-cleanup'], function () {
    return gulp.src(paths.rootHtml, {cwd: bases.appTarget})
                .pipe(preprocess({
                    inline: true,
                    context: {
                        AutoReload: isDevEnvironment
                    }
                }))
                .pipe(gulp.dest(bases.appTarget));
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
});

// https://github.com/mllrsohn/node-webkit-builder
gulp.task('package-app', ['build'], function () {
    var nw = new NwBuilder({
        version: '0.10.4',
        files: [ bases.appTarget + "**"],
        platforms: ['osx'],
        appName: "FinCharts",
        appVersion: "0.0.1",
        buildDir: bases.packageTarget,
        cacheDir: bases.target + "cache"
    });

    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

     // return promise
    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});


gulp.task('build', ['copy', 'stylus', 'scripts', 'post-build-cleanup', 'post-process-files']);

gulp.task('default', function () {
  seq('clean-target', ['build', 'open']);
});

// dev task - enables watchers and autoreload
gulp.task('dev', function () {
  seq('setDevEnv', 'clean-target', ['build', 'watch', 'open', 'notify']);
});

gulp.task('package', function () {
  seq('clean-target', 'package-app');
});




