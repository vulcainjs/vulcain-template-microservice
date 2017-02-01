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
gulp.task("compile-test", ['compile-ts'], function () {
    var tsProject = ts.createProject(
        './tsconfig.json',
        {
            typescript: require('typescript')    // must be a project package dependency
        });

    var tsResult = gulp.src([
        "./test/**/*.ts"
    ], { base: 'test/' })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once("error", function () {
            this.once("finish", () => process.exit(1));
        });

    return tsResult.js
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: "../test/" }))
        .pipe(gulp.dest("dist-test/"));
});

gulp.task("istanbul:hook", function () {
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
        './tsconfig.json',
        {
            typescript: require('typescript')    // must be a project package dependency
        });

    var tsResult = gulp.src([
        "./src/**/*.ts"
    ])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once("error", function () {
            this.once("finish", () => process.exit(1));
        });

    return merge([
        tsResult.dts
            .pipe(gulp.dest('dist')),
        tsResult.js
            .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: "../src/" }))
            .pipe(gulp.dest('dist'))
    ]
    );
});

gulp.task('clean', function (done) { fse.remove('dist', done); });
