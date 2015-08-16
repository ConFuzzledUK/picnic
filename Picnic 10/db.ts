import fs = require('fs');
import mySql = require('mysql');

// Choose config file
var arguments = process.argv.slice(2);
if (arguments[0] == 'dev') {
    var configFile = __dirname + '/config/dev.json';
} else {
    var configFile = __dirname + '/config/config.json';
}

// Define config interfaces
interface configuationData {
    database: mySql.IPoolConfig,
    installPassword: string
}

// Load file and create Database Pool
var dataSting = fs.readFileSync(configFile, 'utf8');
var configData: configuationData = JSON.parse(dataSting);
var pool = mySql.createPool(configData.database);
console.log('Database Pool Established');

export function getPool (){
    return pool;
}

export function getInstallPassword() {
    return configData.installPassword;
}

export class model {
    protected connectionPool: mySql.IPool;

    protected tableName: string;

    constructor() {
        this.connectionPool = pool;
    }

    Count(callback: (res: number, err?: Error) => void) {
        this.connectionPool.query('SELECT COUNT(*) as "result" FROM ??;', [this.tableName], function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                callback(res[0].result);
            }
        });
    }
}