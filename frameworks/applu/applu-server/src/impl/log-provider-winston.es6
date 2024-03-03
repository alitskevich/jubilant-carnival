import winston  from 'winston';

export default function(conf){

    if (!conf){

        conf = {}
    }

   const resolveLevel = l => conf.levels&&conf.levels.hasOwnProperty(l) ? l : 'error';

   winston.addColors(conf.colors||{});

   const transports = [
       new (winston.transports.Console)(conf.console || {
           handleExceptions: true,
           json: true,
           colorize: true,
           prettyPrint: true
       })
   ]

    if (conf.file){
        transports.push(new (winston.transports.File)({
                filename: conf.fileName,
                maxsize: 5242880, //5MB
                maxFiles: 20,
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: true,
                prettyPrint: true
            })
        )
    }

    var logger = new (winston.Logger)({
        levels: conf.levels,
        level: resolveLevel(conf.level||'info'),
        transports
    });

    return logger;
}

