var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');

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