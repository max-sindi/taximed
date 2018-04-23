const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const gutil = require('gutil');
const plumber = require('gulp-plumber');
const cssmin = require('gulp-cssnano');
const prefix = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const clean = require('gulp-clean');

// use for getting not minified html
gulp.task('pug', () => {
  return gulp.src('src/pug/*.pug')
    .pipe( plumber() )
    .pipe( pug({ 
      pretty: true,
    }))
    .pipe(gulp.dest('dist'));
})

// use for getting minified html
gulp.task('pug:prod', ['pug:clean'], () => {
  return gulp.src('src/pug/index.pug')
    .pipe( plumber() )
    .pipe( pug())
    .pipe(gulp.dest('dist'));
})

// delete all .html in dist
gulp.task('pug:clean', () => {
  gulp.src('dist/*.html', {read: false})
    .pipe( clean() )
})

// use for dev
gulp.task('sass', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe( sourcemaps.init() )
    .pipe( sass().on('error', sass.logError) )
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
})


// use for getting production css
gulp.task('sass:prod', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe( sourcemaps.init() )
    .pipe( sass().on('error', sass.logError) )
    .pipe(prefix({
      browsers: ['last 5 versions']
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/css'));
})

gulp.task('img', () => {
    return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('dist/img/'));
})

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js/'));
})

gulp.task('serve', ['sass', 'img', 'pug', 'js'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch('src/pug/**/*.pug',    ['pug']);
    gulp.watch('src/img/**/*.*',     ['img']);
    gulp.watch('src/js/**/*.js',     ['js']);
    gulp.watch("dist/*.*").on('change', browserSync.reload);
})

gulp.task('default', ['serve'])

gulp.task('prod', ['sass:prod', 'pug:prod'])