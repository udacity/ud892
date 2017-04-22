var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('default', function () {
  console.log('gulp is running');
});

gulp.task('styles', function() {
  gulp.src('./sass/**/*.scss')
      .pipe(sass().on('error', sass.logError)) // logs error and continues with build instead of break
      .pipe(gulp.dest('./css'))
});
