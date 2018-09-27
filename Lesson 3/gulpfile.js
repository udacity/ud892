const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

gulp.task("styles", function(done) {
  gulp
    .src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
done(); });

gulp.task("default", gulp.series("styles", function(done) {
  gulp.watch("sass/**/*.scss", gulp.series("styles"));

  browserSync.init({
    server: "./"
  });

done(); }));
