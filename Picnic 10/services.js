var fs = require('fs');
var mySql = require('mysql');
var nodemailer = require('nodemailer');
// Choose config file
var args = process.argv.slice(2);
if (args[0] == 'dev') {
    var configFile = __dirname + '/config/dev.json';
}
else {
    var configFile = __dirname + '/config/config.json';
}
// Load config file
var dataSting = fs.readFileSync(configFile, 'utf8');
var configData = JSON.parse(dataSting);
// Create Database Pool
var pool = mySql.createPool(configData.database);
console.log('Database Pool Established');
// Create Mail Transport
var transporter = nodemailer.createTransport(configData.mail);
function getDatabasePool() {
    return pool;
}
exports.getDatabasePool = getDatabasePool;
function getMailTransporter() {
    return transporter;
}
exports.getMailTransporter = getMailTransporter;
function getSenderDetails() {
    return '"' + configData.senderAddress.name + '" <' + configData.senderAddress.address + '>';
}
exports.getSenderDetails = getSenderDetails;
function getInstallPassword() {
    return configData.installPassword;
}
exports.getInstallPassword = getInstallPassword;
var model = (function () {
    function model() {
        this._isChanged = false;
        this.connectionPool = pool;
    }
    Object.defineProperty(model.prototype, "isChanged", {
        get: function () {
            return this._isChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(model.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (newID) {
            this._id = newID;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    model.prototype.Save = function (properties, callback) {
        var _this = this;
        this.connectionPool.query('UPDATE ? SET ? WHERE `id` = ?', [
            this.tableName,
            properties,
            this.id
        ], function (err, res) {
            if (err)
                console.log('Error Updating ' + _this.objectName + ' ' + _this.id + ': ' + err);
            else {
                console.log('Updated ' + _this.objectName + ': ' + _this.id);
            }
            callback(err, res);
        });
    };
    model.prototype.LoadData = function (callback, id) {
        // Load ID if defined here
        if (id != undefined) {
            this.id = id;
        }
        // Sanity Check
        if (this.id == undefined) {
            callback(new Error('No ID defined when loading'));
            return;
        }
        this.connectionPool.query('SELECT * FROM ?? WHERE `id` = ?', [
            this.tableName,
            this.id
        ], function (err, res) {
            callback(err, res);
        });
    };
    model.prototype.Count = function (callback) {
        this.connectionPool.query('SELECT COUNT(*) as "result" FROM ??;', [this.tableName], function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                callback(res[0].result);
            }
        });
    };
    return model;
})();
exports.model = model;
//# sourceMappingURL=services.js.map