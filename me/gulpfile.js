var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function () {
  console.log('gulp is running');
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('styles', function() {
  gulp.src('./sass/**/*.scss')
      .pipe(sass().on('error', sass.logError)) // logs error and continues with build instead of break
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./css'));
});
