/* eslint-disable no-undef */
export function getConfig() {
  const config = {
    host: "localhost",
    port: 8080,
    contentBase: '',
    browse: false,
    debug: true,
    noCache: false,
  };

  [...process.argv].forEach((arg) => {
    if (/^--help$/.test(arg)) {
      console.log(
        `\nUSAGE\n=====\n
        --help      View this information
        --path=abc  Set path of file server root directory (default is current dir)
        --host=abc  Hostname of http-server (default is "${host}"), use "*" for any host
        --port=abc  Port of http-server (default is "${port}")
        --browse    Open hostname in browser (via "xdg-open")
        --debug     Logging every request
        --no-cache  Disable caching in headers\n`
      );
      process.exit(0);
    } else if (/^--path=.+$/.test(arg)) {
      config.contentBase = arg
        .replace(/^--path=/, "")
        .replace("~", process.env["HOME"])
        .replace(/^\.\//, `${process.cwd()}/`);
    } else if (/^--host=.+$/.test(arg)) {
      config.host = arg.replace(/^--host=/, "");
      if (host == "*") config.host = null;
    } else if (/^--port=.+$/.test(arg)) {
      config.port = arg.replace(/^--port=/, "");
    } else if (/^--browse$/.test(arg)) {
      config.browse = true;
    } else if (/^--debug$/.test(arg)) {
      config.debug = true;
    } else if (/^--no-cache$/.test(arg)) {
      config.noCache = true;
    } else {
      // console.error('Unknown argument "' + arg + '"');
      // console.log('Run with --help argument for view usage information');
    }
  });

  const { host, port, contentBase } = config;

  config.httpBase = `http://${host ? host : "localhost"}:${port}`;

  if (contentBase == null) {
    config.contentBase = process.cwd();
    console.warn(`Path is empty! Will be used current work dir: "${contentBase}"`);
    console.warn("For specific path, start this app with: --path=/specific/path");
  }

  return config;
}
