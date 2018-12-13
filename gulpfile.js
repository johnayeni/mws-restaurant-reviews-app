const gulp = require('gulp');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageResize = require('gulp-image-resize');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const connect = require('gulp-connect');

const reload = browserSync.reload;

// complie sass files to css
gulp.task('styles', () =>
  gulp
    .src('./src/sass/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError),
    )
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream()),
);

// bundle scripts with webpack
gulp.task('scripts', () =>
  gulp
    .src('./src/scripts/**/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify())
    .pipe(gulp.dest('./src/js')),
);

// optimize images
gulp.task('imagemin', () =>
  gulp
    .src('./src/img/**/*.*')
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
    .pipe(gulp.dest('./src/img')),
);

gulp.task('imageResize', () => {
  const widths = [320, 480, 800];
  let stream;
  widths.forEach((width) => {
    stream = gulp
      .src('./src/images/**/*.*')
      .pipe(imageResize({ width }))
      .pipe(
        rename((path) => {
          path.basename += `-${width}w`;
        }),
      )
      .pipe(gulp.dest('./src/img'));
  });
  return stream;
});

// serve files for development
gulp.task(
  'serve',
  gulp.series(['styles'], () => {
    browserSync.init({
      server: './src',
      port: 3000,
    });

    gulp.watch('./src/sass/**/*.scss', gulp.series(['styles']));
    gulp.watch('./src/**/*.html').on('change', reload);
    gulp.watch('./src/**/*.json').on('change', reload);
    gulp
      .watch(['./src/sw.js', './src/scripts/**/*.js'], gulp.series(['scripts']))
      .on('change', reload);
  }),
);

gulp.task('serve:dist', () =>
  connect.server({
    port: 8080,
    root: 'dist',
  }),
);

// copy files to dist folder
gulp.task('copy-images', () => gulp.src('./src/img/*').pipe(gulp.dest('./dist/img')));

gulp.task('copy-icons', () => gulp.src('./src/icons/*').pipe(gulp.dest('./dist/icons')));

gulp.task('copy-css', () => gulp.src('./src/css/**/*.css').pipe(gulp.dest('./dist/css')));

gulp.task('copy-js', () => gulp.src('./src/js/**/*.js').pipe(gulp.dest('./dist/js')));

gulp.task(
  'copy-files',
  gulp.series([
    'copy-images',
    'copy-icons',
    'copy-js',
    'copy-css',
    () => gulp.src(['./src/**/*.html', './src/**/*.json', './src/sw.js']).pipe(gulp.dest('./dist')),
  ]),
);

// clean folders
gulp.task('clean', () =>
  gulp.src(['./src/img', './src/css', './src/js'], { read: false, allowEmpty: true }).pipe(clean()),
);

gulp.task('clean:dist', () => gulp.src('./dist', { read: false, allowEmpty: true }).pipe(clean()));

gulp.task(
  'dist',
  gulp.series([
    'clean',
    'clean:dist',
    'imageResize',
    'imagemin',
    'styles',
    'scripts',
    'copy-files',
    'serve:dist',
  ]),
);

gulp.task(
  'default',
  gulp.series(['clean', 'imageResize', 'imagemin', 'styles', 'scripts', 'serve']),
);
