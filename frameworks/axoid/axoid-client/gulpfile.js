var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence')
var karma = require('karma').server;

var browserSync = require('browser-sync');

var paths = {
  scripts: ['src*/**/*.coffee'],
};

gulp.task('clean', function(cb) {
 	// del(['build'], cb);
	cb()
});

gulp.task('browser-sync', function() {
    browserSync({
        //proxy: '127.0.0.1:3000',
	server: {
	    baseDir: "."
	}	
    });
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
      .pipe($.cached('scripts'))        // only pass through changed files
      //.pipe(jshint())                 // do special things to the changed files...
      .pipe($.plumber())
      .pipe($.coffee())
      //.pipe($.addSrc('axoid.js')) 
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
  var watcher = gulp.watch(paths.scripts, ['scripts', browserSync.reload]); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete $.cached.caches.scripts[event.path];       // gulp-cached remove api
      $.remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });

});

gulp.task('test', function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, cb);
});


// The default task (called when you run `gulp` from cli)
gulp.task('build', ['scripts']);

gulp.task('default', ['clean'], function(cb){
    runSequence('scripts', 'browser-sync', 'watch', cb);
});
