#!/usr/bin/env node
import { createServer } from "http";
import { spawn } from "child_process";
import url from "url";

import { getConfig } from "./config.js";
import { log, assert } from "./utils.js";
import { routes } from "./routes.js";
import { sendError, send, sendResult, sendJson } from "./utils/http.js";

const config = getConfig();
const { httpBase, contentBase, browse, host, port } = config;

function onStarted() {
  log(`HTTP-server started at ${httpBase}`);
  log(`Project base dir: "${contentBase}"`);
  if (browse) {
    log(`Start xdg-open to open page "${httpBase}" in browser`);
    spawn("xdg-open", [httpBase], { stdio: "inherit" });
  }
}

export function handleRequest(context) {
  return (req, res) => {
    req.res = res;
    req.context = context;
    req.contentBase = context.contentBase;
    req.parsedUrl = url.parse(req.url);

    let pathname = decodeURIComponent(req.parsedUrl.pathname.split("+").join(" "));
    while (pathname[0] == "/") {
      pathname = pathname.slice(1);
    }
    req.path = pathname.split("/");

    const op = req.path.shift() || "index";

    log(`HTTP-request operation: "${op}"`, req.path);
    try {
      assert(routes[op], `Unknown operation: ${op}`);
      const result = routes[op](req);
      if (result instanceof Promise) {
        result.then((r) => {
          sendJson(res, r);
        });
        return;
      }
      if (typeof result === "string") {
        return send(res, result, { mime: "text/plain" });
      }
      if (typeof result === "function") {
        return sendResult(res, result);
      }
      sendJson(res, result || {});
    } catch (error) {
      sendError(res, error.message);
    }
  };
}

createServer(handleRequest(config)).listen(port, host, onStarted);
