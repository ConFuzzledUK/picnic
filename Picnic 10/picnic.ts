/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/local.d.ts" />

// Welcome
console.log("");
console.log("Picnic 10 - Codename: DeLorean");
console.log("==============================");
console.log("");

// Import external libraries
import http = require('http');
import path = require('path');
//import https = require('https');
import express = require('express');
import favicon = require('serve-favicon');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import webLogger = require('morgan');

// Creation the application object
var app = express();

// Check if we are in development mode
var arguments = process.argv.slice(2);
if (arguments[0] == 'dev') {
    app.set('env', 'development');
}
else {
    app.set('env', 'production');
}

// Set up Database
import db = require('services');

// Set up auditor
import core = require('./classes/core');
new core.audit();

// Log application start
core.audit.save("System Started");

// Setup Input Parsers
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // Web Form Data
app.use(bodyParser.json()); // JSON Data

// Setup web logging to console
if (app.get('env') == 'development') {
    app.use(webLogger('dev'));
}
else {
    throw 'Not Implemented';
}

// Setup favicon handler
app.use(favicon('./public/favicon.ico'));

// Setup up jQuery redistributables handler
app.use('/js/libs', express.static('node_modules/jquery/dist'));
// Setup up bootstrap redistributables handler
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// Setup up underscore redistributables handler
app.use('/js/libs', express.static('node_modules/underscore'));
// Setup up underscore.string redistributables handler
app.use('/js/libs', express.static('node_modules/underscore.string/dist'));
// Setup up backbone redistributables handler
app.use('/js/libs', express.static('node_modules/backbone'));
// Setup static files handler
app.use(express.static('public'));

// Configure View engine
app.set('views', 'views');
app.set('view engine', 'jade');

// Load Routing handlers
import firstRoutes = require('./routes/first');

app.use('/first', firstRoutes);

// Configure Index Page Handler
app.get('/', function (req, res) {
    var user = new core.User();
    user.Count(function (count) {
        if (count == 0) {
            res.redirect('/first');
        }
        else {
            res.redirect('/first');//throw 'NotImplemented';
        }
    });
});

// Configure Error Handlers
var errorHandler = function (err, req: express.Request, res: express.Response, next: Function) {
    console.log(err.stack);
    next(err);
};
app.use(errorHandler);

// Start Server - TODO: HTTPS, config from JSON
var server = app.listen(1337, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('HTTP Server now listening at http://%s:%s', host, port);
});

// Configure Termination Code
process.on('SIGINT', function () {
    console.log('Going down. Bye!');
    server.removeAllListeners();
    // Wait for database to finish active operations before shutting down
    var db = require('db');
    db.getPool().end(function () {
        process.exit(0);
    });
});
export = app;
