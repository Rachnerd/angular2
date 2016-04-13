var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('./tsconfig.json'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps');



// gulp build
gulp.task('serve', ['clean'], function () {
    runSequence('ts-compile', 'ts-watch', 'browser-sync');
});
// delete dist folder
gulp.task('clean', function (cb) {
    return rimraf('./dist', cb);
});
// compile typescript to javascript and place files in dist
gulp.task('ts-compile', function () {
    console.log('---------------------');
    return gulp.src('app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

// watch TS files and compile when changed
gulp.task('ts-watch', function () {
    return gulp.watch(['app/**/*.ts', 'backend/**/*.ts'], ['ts-compile']);
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ['./', './dist']
        },
        files: [
            'dist/**/*.js',
            'app/**/*.html',
            'index.html',
            'app/**/*.css'
        ],
        logLevel: 'silent', //debug || info
        notify: false
    });
});