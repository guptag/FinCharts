var gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
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
    //watchify    = require('watchify');
    uglify      = require('gulp-uglify')
    seq         = require('run-sequence'),
    react       = require('gulp-react'),
    //reactify    = require('reactify');
    exec        = require('child_process').exec,
    NwBuilder   = require('node-webkit-builder'),
    gutil       = require('gulp-util'),
    Notifier    = new require('node-notifier')();

// load other gulp tasks
require('./Gulpfilemocks')(gulp);

var bases = {
 root: '.',
 src: 'app/',
 target: 'target/',
 appTarget: 'target/app/',
 packageTarget: 'target/package/'
};

var paths = {
  all: "**",
  jsx: 'client/**/*.jsx',
  js: 'client/**/*.js',
  styl: "client/**/*.styl",
  rootStyl: 'index.styl',
  destStyl: 'index.css',
  rootJS: 'index.js',
  rootHtml: 'index.html',
  html: '**/*.html',
  md: '**/*.md'
};

var isDevEnvironment = false;

gulp.task('setDevEnv', function() {
    isDevEnvironment = true;
    console.log("set to dev environment");
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

gulp.task('jshint-react', ['copy'], function () {
  return gulp.src([paths.js, paths.jsx, paths.rootJS], {cwd: bases.appTarget})
            .pipe(react())
            .on('error', function(e) {
                console.error(e.message + '\n  in ' + e.fileName);
            })
            .pipe(jshint('./.jshintrc'))
            .pipe(jshint.reporter(stylish))
            .pipe(gulp.dest(bases.appTarget + "/client"));
});

gulp.task('browserify', ['jshint-react'], function() {

    var bundler = browserify({
                entries: ['./target/app/index.js'],
                debug: isDevEnvironment,
                /*extensions: ['.jsx', '.js'],*/
                paths: ['./target/app/node_modules','./target/app/client/'],
                noparse: ['q', 'lodash', 'react', 'flux', 'moment', 'jquery'],
                cache: {}, // for watchify
                packageCache: {}, // for watchify
                fullPaths: isDevEnvironment // for watchify
            });

    var rebundle = function() {
        gutil.log('Watchify rebundle');
        return bundler.bundle()
                    .pipe(source('client.js'))
                    .pipe(isDevEnvironment ? gutil.noop() : stream(uglify()))
                    .pipe(gulp.dest(bases.appTarget));
    };

    /*if(isDevEnvironment) {
        bundler = watchify(bundler);
        bundler.on('update', rebundle);
    }*/

    return rebundle();
});

gulp.task('post-build-cleanup', ['stylus', 'browserify'], function() {
  // delete unnecessary files in target
  return gulp.src([paths.md, paths.styl, paths.jsx, "client", "index.js"], {read: false, cwd: bases.appTarget})
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
        title: 'FinCharts (App): Build Completed',
        message: 'App will be auto refreshed in a moment...'
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


gulp.task('build', ['copy', 'stylus', 'jshint-react', 'browserify', 'post-build-cleanup', 'post-process-files', 'notify']);

gulp.task('default', function () {
  seq('clean-target', ['build', 'open']);
});

// dev task - enables watchers and autoreload
gulp.task('dev', function () {
  seq('setDevEnv', 'clean-target', ['build', 'watch', 'open']);
});

// builds mocks project
gulp.task('mocks', ['build'], function () {
  seq('mocks-build', 'mocks-app-watch', 'mocks-watch', 'mocks-open');
})

// packages the app
gulp.task('package', function () {
  seq('clean-target', 'package-app');
});




