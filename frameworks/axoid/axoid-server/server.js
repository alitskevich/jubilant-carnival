#!/bin/env node

require("coffee-script/register");
global.CoffeeScript = require("coffee-script");
require("./dist/axoid-server.js");

Object.DEBUG = true;
Object.LOG_LEVEL = 5;

Object.config = {
    ID: "1",
    TITLE: "1",
    VERSION: "0.0.1",
    COPYRIGHT: "2014",
};

Object.fire({
    uri: 'axoid://create/EventHandler#entity',
    onEvent: function(ev) {
      this.log('required entity: '+ev.uri.host);
      require('./js/' + ev.uri.host.replace(/\./g, '/') + '.js');
      ev.callback();
    }
});

Object.fire({
    uri: 'axoid://create/webserver.Application#app',
    config: Object.config,
    ipaddress: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1",
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8000,
    plugins: [
        {
            id:'file',
            type:'webserver.FilesPlugin',
            staticDirs: ['./www']
        }
        ,
        {
            type:'webserver.RequestParsingPlugin'
        }
        ,
        {
            type:'webserver.DispatcherPlugin'
        }
        ,
        {
            type:'webserver.DustPlugin'
        }
        ,
        {
            type:'webserver.ResultPlugin'
        }
        ]
});