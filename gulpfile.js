const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const reload = browserSync.reload;

gulp.task('styles', () =>
  gulp
    .src('./app/sass/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError),
    )
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream()),
);

gulp.task('js:main', () =>
  browserify(['./app/scripts/app.js', './app/scripts/dbhelper.js', './app/scripts/main.js'])
    .transform(
      babelify.configure({
        presets: 2015,
      }),
    )
    .bundle()
    .pipe(source('main_bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./app/js')),
);

gulp.task('scripts:restaurant', () =>
  browserify([
    './app/scripts/app.js',
    './app/scripts/dbhelper.js',
    './app/scripts/restaurant_info.js',
  ])
    .transform(
      babelify.configure({
        presets: 2015,
      }),
    )
    .bundle()
    .pipe(source('restaurant_bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./app/js')),
);

gulp.task('imagemin', () =>
  gulp
    .src('./app/img/**/*.*')
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 50,
          }),
        ],
        {
          verbose: true,
        },
      ),
    )
    .pipe(gulp.dest('./app/img')),
);

gulp.task('serve', ['styles'], () => {
  browserSync.init({
    server: './',
  });

  gulp.watch('./app/sass/**/*.scss', ['styles']);
  gulp.watch('./app/**/**.html').on('change', reload);
  gulp.watch(
    ['./app/sw.js', './app/js/**/*.js'],
    gulp.series(['scripts:main', 'scripts:restaurant']).on('change', reload),
  );
});

gulp.task('copy-files', () =>
  gulp
    .src([
      'app/**/ *.html',
      'app/**/*.json',
      'app/img/*',
      'app/css/**/*.css',
      'app/js/**/*.js',
      'app/sw.js',
    ])
    .pipe(gulp.dest('./dist')),
);

gulp.task(
  'dist',
  gulp.series(['imagemin', 'styles', 'scripts:main', 'scripts:restaurant', 'copy-files']),
);

gulp.task('default', gulp.series(['imagemin', 'scripts:main', 'scripts:restaurant', 'serve']));
