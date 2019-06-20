// refactor updated for Gulp 4 and Lesson 6 - optimizations

// Based on
// https://www.npmjs.com/package/@babel/core
// https://babeljs.io/docs/en/babel-register
// consulted 2019-06-20
// https://gulpjs.com/docs/en/getting-started/creating-tasks#exporting
// https://github.com/jasmine/jasmine-npm/issues/145
// https://github.com/jasmine/jasmine-npm/issues/145#issuecomment-437613065
// https://jasmine.github.io/setup/nodejs.html
// https://stackoverflow.com/questions/51069142/whats-the-difference-between-uglify-js-and-uglify-es
// consulted 2019-06-18 and also
// https://www.sitepoint.com/automate-css-tasks-gulp/
// https://gulpjs.com/docs/en/getting-started/quick-start
// https://gulpjs.com/docs/en/getting-started/creating-tasks
// https://gulpjs.com/docs/en/getting-started/async-completion
// consulted 2019-06-17 as well as the Udacity course materials
// https://classroom.udacity.com/nanodegrees/nd001/parts/20f5a632-38e6-48e7-88c8-e14c21590bb9/modules/de442af7-4ae2-48d7-a613-cf132eeaf60c/lessons/5831481034/concepts/55096392250923
// https://classroom.udacity.com/nanodegrees/nd001/parts/20f5a632-38e6-48e7-88c8-e14c21590bb9/modules/de442af7-4ae2-48d7-a613-cf132eeaf60c/lessons/5876358842/concepts/53738292320923

//          NOTE: Corresponding package.json shown in comments at bottom

// NOTE 2019-06-18--20:
//   It appears that uglify, which is used in the Minification section,
//   does not support ES6,
//   which leads to an error with the test files using const:
// “
// [13:48:18] 'scriptsDist' errored after 291 ms
// [13:48:18] GulpUglifyError: unable to minify JavaScript
// Caused by: SyntaxError: Unexpected token: keyword «const»
// File: /Users/johnkelley/miniconda3/envs/baseNodeJS/ud892/
//  Lesson 4 - Part 2 - Lesson 5/js/all.js
// Line: 11
// Col: 2
// “
//     See: https://stackoverflow.com/questions/51069142/whats-the-difference-between-uglify-js-and-uglify-es
// As a result, when running gulp dist, I changed main.js to use var:
//     (function() {
//       var foo = 12345;
//       return foo;
//     })();


// configuration

// modules

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
// NOTE: in sitepoint post above, this next line is given as
//       browsersync   = devBuild ? require('browser-sync').create() : null;
//       but for right now, I'm sticking with the Udacity syntax
// NOTE: sitepoint post also says:
//       "The browser-sync test server can now be installed — as a development
//       dependency, since it should never be required on a live production
//       device:"
const jasmineBrowser = require('gulp-jasmine-browser');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

function css() {
  return gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
        // browsers: ['last 2 versions']
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function crunchImages() {
  return gulp.src('src/images/*')
    .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
    .pipe(gulp.dest('dist/images'))
}


function copyHTML() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
}

function copyImages() {
  return gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
}

function scripts() {
  return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
}

function scriptsDist() {
  return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
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
  browserSync.init({server: './dist'});
  gulp.watch('sass/**/*.scss', gulp.series(css));
  gulp.watch('js/**/*.js', gulp.series(lint));
  gulp.watch('/index.html', gulp.series(copyHTML));
  // done();
}

// the exports.default method seems to make this the Gulp default
//   See: sitepoint post in "Automating Your Workflow" section
exports.tests = tests;
exports.scripts = scripts;
exports.dist = gulp.series(copyHTML, copyImages, crunchImages, css, scriptsDist, watch);
exports.default = gulp.series(copyHTML, copyImages, css, lint, tests,
    scripts, watch);

// TODO:
// 1.  Need to sort out the dependencies regarding Babel.
// As shown in the corresponding package.json file below,
// currently using both

//   "devDependencies": {
//     "@babel/core": "^7.4.5",
//     "@babel/register": "^7.4.4", ....
//   },
//   "dependencies": {
//     ....
//     "gulp-babel": "^8.0.0",

// I believe this shouldn't be necessary, but when I just used gulp-babel
// I was getting errors, and the following pages suggested a different
// approach, which I've used as a temporary measure:
// https://www.npmjs.com/package/@babel/core
// https://babeljs.io/docs/en/babel-register

// 2.   Not sure about the order in either of these, and they need to be
//      checked further:
//        exports.dist = gulp.series(copyHTML, copyImages, crunchImages,
//          css, scriptsDist, watch);
//        exports.default = gulp.series(copyHTML, copyImages, css, lint, tests,
//          scripts, watch);

// 3.  Terminal version of tests(), gulp tests, generates non-fatal errors,
//          which appear to arise from Jasmine configuration:

// "
// $ gulp tests
// [11:53:02] Using gulpfile ~/miniconda3/envs/baseNodeJS/ud892/Lesson 4
// - Part 2 -Lesson 5/gulpfile.js
// [11:53:02] Starting 'tests'...
// [11:53:02] Jasmine server listening on port 8000
// error: DEPRECATION: Setting stopOnSpecFailure directly is deprecated,
// please use the failFast option in `configure`
// error: DEPRECATION: Setting throwOnExpectationFailure directly on Env
// is deprecated, please use the oneFailurePerSpec option in `configure`
// error: DEPRECATION: Setting randomizeTests directly is deprecated,
// please use the random option in `configure`
// error: DEPRECATION: Setting specFilter directly on Env is deprecated,
// please use the specFilter option in `configure`
// F
// Failures:
// 1) window height returns window height
// 1.1) ReferenceError: getWindowHeight is not defined

// 1 spec, 1 failure
// Finished in 0 seconds
// [11:53:02] 'tests' errored after 974 ms
// [11:53:02] Error: 1 failure.....
// "

// For future work on this, see especially:
// https://github.com/jasmine/jasmine-npm/issues/145
//     cited here: https://github.com/jasmine/jasmine-npm/issues/145#issuecomment-437613065
// https://jasmine.github.io/setup/nodejs.html

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
//     "@babel/core": "^7.4.5",
//     "@babel/register": "^7.4.4",
//     "eslint": "^5.16.0",
//     "eslint-config-google": "^0.13.0",
//     "gulp-autoprefixer": "^6.1.0",
//     "gulp-eslint": "^5.0.0",
//     "gulp-sass": "^4.0.2"
//   },
//   "dependencies": {
//     "browser-sync": "^2.26.7",
//     "gulp": "^4.0.2",
//     "gulp-babel": "^8.0.0",
//     "gulp-concat": "^2.6.1",
//     "gulp-imagemin": "^6.0.0",
//     "gulp-jasmine-browser": "^4.1.0",
//     "gulp-sourcemaps": "^2.6.5",
//     "gulp-uglify": "^3.0.2",
//     "imagemin": "^6.1.0",
//     "imagemin-pngquant": "^8.0.0",
//     "jasmine": "^3.4.0",
//     "jasmine-core": "^3.4.0",
//     "puppeteer": "^1.17.0"
//   },
//   "browserslist": [
//     "last 1 version",
//     "> 1%",
//     "maintained node versions",
//     "not dead"
//   ]
// }
