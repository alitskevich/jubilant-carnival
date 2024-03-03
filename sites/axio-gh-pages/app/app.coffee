# Axio.JS application.

global = window;

LOCATION = Object.parseUri(global.location.href);

DEBUG = true;

String.LANGUAGE = LOCATION.params.language || "en";

APP = 
    id : "axio"
    title : "Axio.JS"
    VERSION: DEBUG ? -1 : '2.0.2'
    copyright : '2009-2013, Alex Litskevich'
    link : 'https://github.com/alitskevich/AxioJS'
    dependensies:['js://app/l10n', 'js://libs/showdown', 'js://libs/hljs']


# @define UI [App] entity
Object.entity.define('Application extends dhtml', 
    htmlUrlExpression : '"page://"+(${*nav})'

    methods : (_super) ->
            init : () ->
                _super.init.apply(this, arguments)
)

# register async listener for cached resources
Object.cache.createJSSource(APP.VERSION, '{0}.js?v=#{APP.VERSION}')

Object.entity.create id:"WebStorage:settings"


# register async listener for L10N API calls
Object.listen('page', Object.createVersionedCacheSource(
    version:APP.VERSION, 
    cacheDeserializer: Function.NONE,
    urlTemplate:'app/pages/{0}.html'
));

Object.require(APP.dependensies,  (err) -> Object.dom.init())
