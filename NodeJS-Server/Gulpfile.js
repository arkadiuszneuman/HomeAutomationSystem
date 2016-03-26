var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var pkg = require('./package.json');
var banner = ['/**',
    ' * <%= pkg.description %> <%= pkg.version %>',
    ' * ©<%= new Date().getFullYear() %>',
    ' * All rights reserved',
    ' */',
    ''].join('\n');

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('js', function () {
    return gulp.src(['public/js/**/*.js', '!public/js/template/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(concat('has.min.js'))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('less', function () {
    return gulp.src('public/**/*.less')
        .pipe(less())
        .on('error', swallowError)
        .pipe(gulp.dest('public/'));
});

gulp.task('css', ['less', 'css_bower'], function () {
    return gulp.src('public/css/**/*.css')
        .pipe(concat('has.min.css'))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('css_bower', function () {
    var css = require('./bower_components.json').css;
    for (var i = 0; i < css.length; ++i) {
        css[i] = 'bower_components/' + css[i];
    }

    return gulp.src(css)
        .pipe(concat('external.min.css'))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js_bower', function () {
    var js = require('./bower_components.json').js;
    for (var i = 0; i < js.length; ++i) {
        js[i] = 'bower_components/' + js[i];
    }
    
    return gulp.src(js)
        .pipe(concat('external.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('public/js/**/*.js', ['js']);
    gulp.watch('bower_components/**/*.js', ['js_bower']);
    gulp.watch('public/**/*.less', ['less']);
    gulp.watch('public/css/**/*.css', ['css']);
});

gulp.task('default', ['js', 'css', 'less']);