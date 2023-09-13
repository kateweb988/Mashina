const gulp 			= require('gulp');
const sass 			= require('gulp-sass');
const browserSync	= require('browser-sync').create();
const autoprefix	= require('gulp-autoprefixer');
const cleanCSS		= require('gulp-clean-css');
const uglifyJS		= require('gulp-uglify');
const htmlmin 		= require('gulp-htmlmin');
const babel 		= require('gulp-babel' );
const concat		= require('gulp-concat');

gulp.task('styles', styles);
gulp.task('sctipts', sctipts);
gulp.task('htmls', htmls);
gulp.task('init', gulp.parallel('styles', 'sctipts', 'htmls'));

gulp.task('stylesBuild', stylesBuild);
gulp.task('sctiptsBuild', sctiptsBuild);
gulp.task('htmlsBuild', htmlsBuild);
gulp.task('build', gulp.parallel('stylesBuild', 'sctiptsBuild', 'htmlsBuild'));

gulp.task('serve', watch);

// Build
function stylesBuild(){
	return gulp.src('src/sass/main.sass')
		.pipe(sass({
			errorLogToConsole: true
		}))
		.on('error', console.error.bind(console))
		.pipe(autoprefix({
			overrideBrowserslist: ['last 4 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(gulp.dest('build/css'));
}

function sctiptsBuild(){
	return gulp.src(['src/js/jquery-3.4.1.min.js', 'src/js/main.js'])
		.pipe(babel({
			 presets:  ['env']
		}))
		.pipe(uglifyJS({
			toplevel: true
		}))
		.pipe(concat('all.js'))
		.pipe(gulp.dest('build/js/'));
}

function htmlsBuild(){
	return gulp.src('src/**/*.html')
		.pipe(htmlmin({ collapseWhitespace:  true }))
		.pipe(gulp.dest('build/'));
}

// Dev
function styles(){
	return gulp.src('src/sass/main.sass')
		.pipe(sass({
			errorLogToConsole: true
		}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest('dev/css'))
		.pipe(browserSync.stream());
}

function sctipts(){
	return gulp.src(['src/js/jquery-3.4.1.min.js', 'src/js/main.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dev/js/'))
		.pipe(browserSync.stream());
}

function htmls(){
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('dev/'))
		.pipe(browserSync.stream());
}

function watch(){
	browserSync.init({
		server: {
			baseDir: './dev'
		},
		//tunnel: true
	});
	gulp.watch('src/sass/**/*.sass', styles);
	gulp.watch('src/js/**/*.js', sctipts);
	gulp.watch('src/*.html', htmls);
}