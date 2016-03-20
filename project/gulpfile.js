var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		plumber = require('gulp-plumber'),
		jade = require('gulp-jade'),
		autoprefixer = require('gulp-autoprefixer'),
		svgstore = require('gulp-svgstore'),
		svgmin = require('gulp-svgmin'),
		sass = require('gulp-sass'),
		path = require('path'),
		inject = require('gulp-inject');

gulp.task('sass', function() {
	gulp.src('./assets/css/sass/**/*.{sass, scss}')
		 	.pipe(sass().on('error', sass.logError))
		 	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'))
		 	.pipe(gulp.dest('./assets/css/styles'))
		 	.pipe(browserSync.stream());
});

gulp.task('templates', function() {
	var locals = {};

	gulp.src('*.jade')
			.pipe(plumber())
			.pipe(jade({
				locals: locals,
				pretty: true
			}))
			.pipe(gulp.dest('./'))
});

gulp.task('browser-sync', ['sass'], function() {
  browserSync.init({
      server: "./"
  });

  gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('svgstore', function() {
	console.log('SVGStore');
	var svgs = gulp.src('assets/_svgs/*.svg')
									.pipe(svgmin())
									.pipe(svgstore({ inlineSvg: true }));

	var fileContents = function(filePath, file) {
		return file.contents.toString();
	}

	gulp.src('./svgs.html')
			.pipe(plumber())
			.pipe(inject(svgs, { transform: fileContents }))
			.pipe(gulp.dest('./'))
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('./assets/css/sass/**/*.{sass,scss}', ['sass']);
	gulp.watch('*.jade', ['templates']);
	gulp.watch('includes/*.jade', ['templates']);
	gulp.watch('assets/_svgs/*.svg', ['svgstore']);
});

gulp.task('default', ['watch']);
