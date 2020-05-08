const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');





/*  --------------  Server  --------------  */
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 8000,
            baseDir: "build"
        }
    });


    gulp.watch('build/**/*').on('change', browserSync.reload);
});


/*  --------------  Pug Compile  --------------  */
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
             pretty: true
        }))

        .pipe(gulp.dest('build'))
});


/*  --------------  Styles Compile  --------------  */
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

/*  --------------  Sprite  --------------  */
gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.css'
    }));

    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('source/styles/global'));
    cb();
});


/*  --------------  Delete  --------------  */
gulp.task('clean', function del (cb) {
    return rimraf('build', cb)
});



/*  --------------  Copy Fonts  --------------  */
gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});


/*  --------------  Copy Images  --------------  */
gulp.task('copy:images', function() {
    return gulp.src('./source/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});
/*  --------------  Copy   --------------  */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/*  --------------  Wathers  --------------  */
gulp.task('watch', function () {
    gulp.watch('source/js/*.js');
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});



gulp.task('copy:script', function() {
    return gulp.src('./source/js/**/*.*')
        .pipe(gulp.dest('build/js'));
});

/*  --------------  Default  --------------  */
gulp.task('default', gulp.series(

    gulp.parallel('templates:compile','styles:compile','copy:script' ,'copy'),
    gulp.parallel('watch', 'server')
)
);