var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
    gulp.src('./src/**/*.ts')
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**/*.ts', ['build']);
});
