var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  scripts: ['src*/**/*.coffee'],
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
      .pipe($.cached('scripts'))        // only pass through changed files
      //.pipe(jshint())                 // do special things to the changed files...
      .pipe($.plumber())
      .pipe($.coffee())
      .on('error', console.log)
      //.pipe(uglify())
      .pipe($.remember('scripts'))      // add back all files to the stream
      .pipe($.concat('index.js'))         // do things that require all files
      .pipe(gulp.dest(''))
      .pipe($.uglify())
      .pipe($.concat('index.min.js'))         // do things that require all files
      .pipe(gulp.dest(''))
      ;
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  var watcher = gulp.watch(paths.scripts, ['scripts']); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete $.cached.caches.scripts[event.path];       // gulp-cached remove api
      $.remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });

});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['scripts']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts']);
