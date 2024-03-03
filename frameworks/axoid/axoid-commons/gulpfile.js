var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var through = require('through2');
var gulpSequence = $.sequence.use(gulp);

var globs = {
    src: ['./src/**/*.coffee']
};

//postinstall hook
gulp.task('postinstall',['build','test'], function(cb) {
    $.util.log("[postinstall]: done.");
    cb();
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    var watcher = gulp.watch(globs.src, ['build']); // watch the same files in our scripts task
});

gulp.task('test', function(cb) {

    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, cb);

});

gulp.task('reindex', function() {

    var doSwig = function(all) {
        $.util.log(all);
        var opts = {
            data: {
                files: all
            }
        }
        gulp.src('./tools/main.template.js')
        //.pipe($.data(function(file) {            return {files:all};        }))
        .pipe($.swig(opts))
            .pipe($.rename('index.js'))
            .pipe(gulp.dest('./src'))

    };

    var all = [];

    gulp.src(globs.src, {
        base: './src',
        read: false
    })
        .pipe(through.obj(function(file, enc, callback) {
        callback(null, file)
    }))
        .on('data', function(data) {
        all.push(data)
    })
        .on('end', function() {
        doSwig(all)
    })

});

gulp.task("webpack:build", function(done) {

    var webpack = require("webpack");
    var webpackConfig = require("./webpack.config.js");

    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new $.util.PluginError("webpack:build", err);
        $.util.log("[webpack:build]", stats.toString({
            colors: true
        }));
        done();
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', gulpSequence('reindex', 'webpack:build'));

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'build']);