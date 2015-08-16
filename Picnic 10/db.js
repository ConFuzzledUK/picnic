var fs = require('fs');
var mySql = require('mysql');
// Choose config file
var arguments = process.argv.slice(2);
if (arguments[0] == 'dev') {
    var configFile = __dirname + '/config/dev.json';
}
else {
    var configFile = __dirname + '/config/config.json';
}
// Load file and create Database Pool
var dataSting = fs.readFileSync(configFile, 'utf8');
var configData = JSON.parse(dataSting);
var pool = mySql.createPool(configData.database);
console.log('Database Pool Established');
function getPool() {
    return pool;
}
exports.getPool = getPool;
function getInstallPassword() {
    return configData.installPassword;
}
exports.getInstallPassword = getInstallPassword;
var model = (function () {
    function model() {
        this.connectionPool = pool;
    }
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
//# sourceMappingURL=db.js.map