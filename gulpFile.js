var os = require('os');
var Path = require('path');
var fs = require('fs');

var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    merge = require('merge2'),
    fse = require('fs-extra'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    sourcemaps = require('gulp-sourcemaps'),
    tslint = require("gulp-tslint");

gulp.task('default', ['tslint', 'clean', 'compile-ts']);

gulp.task('tslint', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report())
        .on("error", function () {
            process.exit(1);
        });;
});

// -----------------------------------
// Test
// -----------------------------------
gulp.task('test', ['compile-test'], function () {
    return gulp.src(['./dist-test/**/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports());
    // Enforce a coverage of at least 90%
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task("compile-test", ["istanbul:hook"], function () {
    var tsProject = ts.createProject(
        './test/tsconfig.json',
        {
            typescript: require('typescript')    // must be a project package dependency
        });

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once("error", function () {
            this.once("finish", () => process.exit(1));
        });

    return tsResult.js
        .pipe(sourcemaps.write('../dist-test', { includeContent: false, sourceRoot: "../test" }))
        .pipe(gulp.dest("dist-test"));
});

gulp.task("istanbul:hook", ['compile-ts'], function () {
    return gulp.src(['dist/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

// -----------------------------------
// Compilation
// -----------------------------------

gulp.task("compile-ts", ['tslint', 'clean'], function () {
    var tsProject = ts.createProject(
        './src/tsconfig.json',
        {
            typescript: require('typescript')    // must be a project package dependency
        });

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once("error", function () {
            this.once("finish", () => process.exit(1));
        });

    return merge([
        tsResult.dts
            .pipe(gulp.dest('dist')),
        tsResult.js
            .pipe(sourcemaps.write('../dist', { includeContent: false, sourceRoot: "../src" }))
            .pipe(gulp.dest('dist'))
    ]
    );
});

gulp.task('clean', function (done) { fse.remove('dist', done); });
