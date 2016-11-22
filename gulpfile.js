var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

gulp.task('build', function() {
    gulp.src(['src/**/*.js', 'src/*.js'])
        .pipe(concat('ng-math-factory.js'))
        .pipe(gulp.dest('dist/'))
});

gulp.task('minify', function() {
    gulp.src(['src/**/*.js', 'src/*.js'])
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))
        .pipe(concat('ng-math-factory.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
});

gulp.watch(['src/**/*.js', 'src/*.js'], ['minify', 'build']);