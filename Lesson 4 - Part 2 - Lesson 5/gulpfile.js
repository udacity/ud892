// NOTE:    Based on
//          https://gulpjs.com/docs/en/getting-started/creating-tasks#exporting
//          consulted 2019-06-18 and also
//          https://www.sitepoint.com/automate-css-tasks-gulp/
//          https://gulpjs.com/docs/en/getting-started/quick-start
//          https://gulpjs.com/docs/en/getting-started/creating-tasks
//          https://gulpjs.com/docs/en/getting-started/async-completion
//          consulted 2019-06-17 as well as the Udacity course materials
//          https://classroom.udacity.com/nanodegrees/nd001/parts/20f5a632-38e6-48e7-88c8-e14c21590bb9/modules/de442af7-4ae2-48d7-a613-cf132eeaf60c/lessons/5831481034/concepts/55096392250923
//          https://classroom.udacity.com/nanodegrees/nd001/parts/20f5a632-38e6-48e7-88c8-e14c21590bb9/modules/de442af7-4ae2-48d7-a613-cf132eeaf60c/lessons/5876358842/concepts/53738292320923

//          NOTE: Corresponding package.json shown in comments at bottom

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
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  eslint = require('gulp-eslint'),
  jasmineBrowser = require('gulp-jasmine-browser');

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

function lint() {
  return gulp.src('js/**/*.js')
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
}

// runs tests to terminal; use either this or the alternative below
// function tests() {
//   return gulp.src('tests/spec/extraSpec.js')
//     .pipe(jasmineBrowser.specRunner({ console: true }))
//     .pipe(jasmineBrowser.headless({ driver: 'chrome' }));
// }

// ALTERNATIVE: runs tests to browser
function tests() {
  return gulp.src('tests/spec/extraSpec.js')
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({ port: 3001 }));
}

//  NOTE done() here seems to as as a completion call back
      // see: https://gulpjs.com/docs/en/getting-started/async-completion
      //   section: https://gulpjs.com/docs/en/getting-started/async-completion#using-an-error-first-callback

function watch (done) {
  browserSync.init({server: './'});
  gulp.watch('sass/**/*.scss', gulp.series(css));
  gulp.watch('js/**/*.js', gulp.series(lint));
}

// the exports.default method seems to make this the Gulp default
//   See: sitepoint post in "Automating Your Workflow" section
exports.tests = tests;
exports.default = gulp.series(css, lint, tests, watch);


// COMMENTS
// Corresponding package.json

// {
//   "name": "lesson4-5",
//   "version": "1.0.0",
//   "description": "",
//   "main": "gulpfile.js",
//   "directories": {
//     "test": "tests"
//   },
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "author": "",
//   "license": "ISC",
//   "devDependencies": {
//     "eslint": "^5.16.0",
//     "eslint-config-google": "^0.13.0",
//     "gulp-autoprefixer": "^6.1.0",
//     "gulp-eslint": "^5.0.0",
//     "gulp-sass": "^4.0.2"
//   },
//   "dependencies": {
//     "browser-sync": "^2.26.7",
//     "gulp": "^4.0.2",
//     "gulp-jasmine-browser": "^4.1.0",
//     "jasmine-core": "^3.4.0",
//     "jasmine": "^3.4.0",
//     "puppeteer": "^1.17.0"
//   },
//   "browserslist": [
//     "last 2 versions",
//     "> 1%",
//     "maintained node versions",
//     "not dead"
//   ]
// }

