// INTRO:   Having spent more time Lessons 3 and 4 than I had anticipated,
            // I think that the fundamental problem with the entire module as it relates to
            // Gulp is that the material seems based on Gulp 3, which is now deprecated,
            // as opposed to Gulp 4.  Thus, by default, when I installed Gulp with npm,
            // I was getting a version that was not really compatible with the course content.
            // This was surprising, and for Lesson 4 I ended up rewriting gulpfile.js to be
            // compatible with Gulp 4.

// NOTE:    Based on https://www.sitepoint.com/automate-css-tasks-gulp/
//          https://gulpjs.com/docs/en/getting-started/quick-start
//          https://gulpjs.com/docs/en/getting-started/creating-tasks
//          https://gulpjs.com/docs/en/getting-started/async-completion
//          consulted 2019-06-17 as well as the Udacity course materials
//          https://classroom.udacity.com/nanodegrees/nd001/parts/20f5a632-38e6-48e7-88c8-e14c21590bb9/modules/de442af7-4ae2-48d7-a613-cf132eeaf60c/lessons/5831481034/concepts/55096392250923


// configuration

  // modules

const

  gulp = require('gulp'),
  sass = require('gulp-sass'),
  // autoprefixer = require('gulp-autoprefixer'),
  // NOTE: in sitepoint post above, this next line is given as
  //       browsersync   = devBuild ? require('browser-sync').create() : null;
  //       but for right now, I'm sticking with the Udacity syntax
  // NOTE: sitepoint post also says:
    // "The browser-sync test server can now be installed — as a development
    // dependency, since it should never be required on a live production
    // device:"
  browserSync = require('browser-sync').create();
  autoprefixer = require('gulp-autoprefixer');


// function helloGulp () {
//   console.log('hello world from inside gulpfile.js!');
//   done();
// }

function css() {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        // browsers: ['last 2 versions']
      })
    )
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}

//  NOTE done() here seems to as as a completion call back
      // see: https://gulpjs.com/docs/en/getting-started/async-completion
      //   section: https://gulpjs.com/docs/en/getting-started/async-completion#using-an-error-first-callback

function watch (done) {
  browserSync.init({server: './'});
  gulp.watch('sass/**/*.scss', gulp.series(css));
}

// the exports.default method seems to make this the Gulp default
//   See: sitepoint post in "Automating Your Workflow" section
exports.default = gulp.series(css, watch);


