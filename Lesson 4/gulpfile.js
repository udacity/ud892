/*eslint-env node */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('default', ['styles', 'lint'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);

	browserSync.init({
		server: './'
	});
});

gulp.task('styles', function() {
	gulp
		.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function() {
	return (
		gulp
			.src(['js/**/*.js'])
			// eslint() attaches the lint output to the eslint property
			// of the file object so it can be used by other modules.
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failOnError last.
			.pipe(eslint.failOnError())
	);
});

gulp.task('tests', function() {
	return gulp
		.src('tests/spec/extraSpec.js')
		.pipe(jasmineBrowser.specRunner({ console: true }))
		.pipe(jasmineBrowser.headless({ driver: 'chrome' }));
});

// gulp.task('tests', function() {
// 	gulp
// 		.src('tests/spec/extraSpec.js')
// 		.pipe(jasmineBrowser.specRunner())
// 		.pipe(jasmineBrowser.server({ port: 3001 }));
// });
