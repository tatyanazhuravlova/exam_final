


var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    sourcemaps  = require('gulp-sourcemaps');
    copy2       = require('gulp-copy2');
    autoprefixer= require('gulp-autoprefixer');
    svgSprite   = require('gulp-svg-sprite');
    svgo        = require('gulp-svgo'),
    svg2png     = require('gulp-svg2png'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify');

// svg-sprite config
config = {
  shape: {
    dimension: {         // Set maximum dimensions
      maxWidth: 60,
      maxHeight: 60
    },
    spacing: {         // Add padding
      padding: 10
    },
    dest: 'out/intermediate-svg'    // Keep the intermediate files
  },
  mode: {
    view: {         // Activate the «view» mode
      bust: false,
      render: {
        scss: true      // Activate Sass output (with default options)
      }
    },
  }
};

gulp.task('build', ['csso', 'ie', 'script'], function() {
  var paths = [
      {src: './index.html', dest: './build/'},
      {src: './css/dist/*.css', dest: './build/css/'},
      {src: './css/*.htc', dest: './build/css/'},
      {src: './css/vendor/*.*', dest: './build/css/vendor/'},
      {src: './js/dist/*.*', dest: './build/js/'},
      {src: './js/vendor/*.*', dest: './build/js/vendor/'},
      {src: './img/*.*', dest: './build/img/'},
      {src: './fonts/**/*.*', dest: './build/fonts/'}
  ];
  return copy2(paths);
});

gulp.task('svgsprite', function() {
  return gulp.src('img/src-svg/*.svg')
  .pipe(svgo())
  .pipe(svgSprite(config))
  .pipe(gulp.dest('img/svg'));
});

gulp.task('svg2png', function () {
    gulp.src('img/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('img'));
});

gulp.task('sass', function() {
  return gulp.src('css/scss/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
      browsers: ['> 2%', 'IE 8'],
      cascade: false
    }))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('csso', ['sass'], function () {
    return gulp.src('css/style.css')
        .pipe(csso())
        .pipe(gulp.dest('css/dist/'));
});

gulp.task('ie', function() {
  return gulp.src('js/ie/*.js')
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(concat('ie.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('js/dist/'));
});

gulp.task('script', function() {
  return gulp.src('js/script.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('js/dist/'));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
      }
  });
});

gulp.task('watch', ['browserSync', 'sass', 'ie'], function() {
  gulp.watch('css/scss/**/*.scss', ['sass']);
  gulp.watch('**/*.html', browserSync.reload);
  gulp.watch('**/*.js', browserSync.reload);
});
