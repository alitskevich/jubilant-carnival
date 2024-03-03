import fs from "fs";
import http from "http";
import { getConfig } from "../config.js";

const config = getConfig();
const { contentBase, ssePort = 3003 } = config;

function sendServerSideEvent(_req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  });

  var sseId = `e${Date.now()}`;

  const ping = (data = "all") => {
    res.write(`id: ${sseId}\ndata: ${data}\n\n`);
  };

  fs.watch(contentBase, { recursive: true }, function (event, filename) {
    console.log(`event is: ${event}`);
    ping(filename ?? '');
  });

  ping();
}

console.log(`contentBase is: ${contentBase}`);

http.createServer(sendServerSideEvent).listen(ssePort);
