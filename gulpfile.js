var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
	gulp.src(['./index.js', './test/test.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('test', function() {
	gulp.src('./test/test.js')
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('cat', function() {
	gulp.src('./test/test.js')
		.pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('default', ['lint', 'test']);
