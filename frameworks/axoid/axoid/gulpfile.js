var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var karma = require('karma').server;

var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

gulp.task("build", function (done) {
    var config = Object.create(webpackConfig);

    // run webpack
    webpack(config, function (err, stats) {
        if (err) throw new $.util.PluginError("webpack:build", err);
        $.util.log("[webpack:build]", stats.toString({
            colors: true
        }));
        done();
    });
});

gulp.task('test', ['build'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, cb);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['test']);
