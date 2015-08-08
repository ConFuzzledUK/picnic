console.log("");
console.log("Picnic 10 - Codename: DeLorean");
console.log("==============================");
console.log("");
var express = require('express');
var app = express();
var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
//# sourceMappingURL=picnic.js.map