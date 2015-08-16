/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/local.d.ts" />
// Welcome
console.log("");
console.log("Picnic 10 - Codename: DeLorean");
console.log("==============================");
console.log("");
//import https = require('https');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webLogger = require('morgan');
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
// Set up auditor
var core = require('./classes/core');
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
app.use('/jQuery', express.static('node_modules/jquery/dist'));
// Setup up bootstrap redistributables handler
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// Setup static files handler
app.use(express.static('public'));
// Configure View engine
app.set('views', 'views');
app.set('view engine', 'jade');
// Load Routing handlers
var firstRoutes = require('./routes/first');
app.use('/first', firstRoutes);
// Configure Index Page Handler
app.get('/', function (req, res) {
    var user = new core.user();
    user.Count(function (count) {
        if (count == 0) {
            res.redirect('/first');
        }
        else {
            throw 'NotImplemented';
        }
    });
});
// Configure Error Handlers
var errorHandler = function (err, req, res, next) {
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
    process.exit(0);
});
module.exports = app;
//# sourceMappingURL=picnic.js.map