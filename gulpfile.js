const {src, dest, watch, parallel, series} = require('gulp')

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const svgSprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')


function convertFonts() {
	return src('dev/static/fonts/*.ttf') // Путь к шрифтам TTF
	  .pipe(ttf2woff2()) // Преобразовываем TTF в WOFF2
	  .pipe(dest('build/static/fonts')) // Сохраняем шрифты WOFF2 в папке build/static/fonts
	  .pipe(ttf2woff()) // Преобразовываем TTF в WOFF
	  .pipe(dest('build/static/fonts')); // Сохраняем шрифты WOFF в папке build/static/fonts
  }


let srcImage = {
	img: 'dev/static/images/**/*.{jpg,png,svg,gif,ico,webp}',
	svg: 'dev/static/images/svg/*.svg',
	svgOutline: 'dev/static/images/svgoutline/*.svg',
}

function images() {
	return src([
		srcImage.img,
		'!' + srcImage.svg
	])
	.pipe(dest('build/static/images'))
	.pipe(webp({ quality: 80 }))
	.pipe(dest('build/static/images'))
	.pipe(browserSync.stream())
}

function svg() {
	return src(srcImage.svg)
	.pipe(imagemin([
		imagemin.svgo({
			plugins: [
				{ removeViewBox: true },
				{ cleanupIDs: false },
				{ removeAttrs: { attrs: '(stroke|fill)' } }
			]
		})
	]))
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: 'sprite.svg'
			}
		}
	}))
	.pipe(dest('build/static/images/svg'))
	.pipe(browserSync.stream())
}

function svgOutline() {
	return src(srcImage.svgOutline)
	.pipe(imagemin([
		imagemin.svgo({
			plugins: [
				{ removeViewBox: true },
				{ cleanupIDs: false },
				// { removeAttrs: { attrs: '(stroke|fill)' } }
			]
		})
	]))
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: 'spriteoutline.svg'
			}
		}
	}))
	.pipe(dest('build/static/images/svgoutline'))
	.pipe(browserSync.stream())
}

function pugToHtml() {
    return src('dev/pug/*.pug')
      .pipe(pug({pretty: true}))
      .pipe(dest('build'))
	  .pipe(browserSync.stream())
}

function styles() {
    return src('dev/static/styles/styles.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
            .pipe(scss().on('error', scss.logError))
            .pipe(autoprefixer({overrideBrowserslist:  ['last 10 versions']}))
			.pipe(sourcemaps.write())
			.pipe(rename('styles.min.css'))
            .pipe(dest('build/static/css'))
            .pipe(browserSync.stream())
}

function scripts() {
    return src('dev/static/js/**/*.js')
            .pipe(dest('build/static/js'))
            .pipe(browserSync.stream())
}
  
function watching() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    })
    watch(['dev/static/styles/**/*.scss'], styles)
    watch(['dev/static/js/**/*.js'], scripts)
    watch(['dev/static/images/**/*.*'], parallel(images, svg, svgOutline))
    watch(['dev/pug/**/*.pug'], pugToHtml)
} 


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.pugToHtml = pugToHtml;
exports.images = images;
exports.svg = svg;
exports.svgOutline = svgOutline;
exports.convertFonts = convertFonts;

exports.default = series(parallel(styles, scripts, pugToHtml, images, svg, svgOutline, watching),convertFonts);

// exports.default = parallel(styles, scripts, watching, convertFonts, pugToHtml, images, svg);