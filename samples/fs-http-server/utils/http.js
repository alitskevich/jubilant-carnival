import { UTF8 } from "../consts.js";

export function sendResult(res, fn) {
  try {
    sendJson(res, fn());
  } catch (error) {
    sendError(res, error.message);
  }
}
export function sendJson(res, obj) {
  send(res, JSON.stringify(obj, null, 2));
}

export function sendError(res, errMsg, code = 500) {
  console.error(errMsg);
  send(res, `Error ${code}. ${errMsg}`, { code });
}

export function send(res, content, { code = 200, mime = "application/json", charset = UTF8, headers } = {}) {
  res.writeHead(code, {
    ["Content-Type"]: `${mime}; charset=${charset}`,
    ["Access-Control-Allow-Origin"]: "*",
    // eslint-disable-next-line no-undef
    ["Content-Length"]: Buffer.byteLength(content, UTF8),
    ...headers,
  });

  res.end(content);
}

export function sendFile(res, fullPath, { debug }) {
  debug && console.log(`Opening file "${fullPath}" ...`);
  var stream = fs.createReadStream(fullPath, "binary", {
    flags: "r",
    encoding: UTF8,
    autoClose: true,
  });

  Object.assign(head, {
    ["Content-Length"]: fileStat.size,
  });

  res.writeHead(200, head);

  log(`Reading file "${fullPath}" ...`);
  stream.on("data", function (chunk) {
    res.write(chunk, "binary");
  });

  stream.on("error", function (err) {
    debug && console.error(`Read file error "${fullPath}"${msgHTTP500}`);
    tellAboutError(500, "Cannot read file.");
  });

  stream.on("end", function () {
    log(`Reading file "${fullPath}" is finished`);
    res.end();
  });
}
