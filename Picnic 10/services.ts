import fs = require('fs');
import mySql = require('mysql');
import nodemailer = require('nodemailer');

// Choose config file
var args = process.argv.slice(2);
if (args[0] == 'dev') {
    var configFile = __dirname + '/config/dev.json';
} else {
    var configFile = __dirname + '/config/config.json';
}

// Define config interfaces
interface configuationData {
    database: mySql.IPoolConfig,
    mail: { service: string, auth: { user: string, pass: string } },
    senderAddress: { name: string, address: string },
    installPassword: string
}

// Load config file
var dataSting = fs.readFileSync(configFile, 'utf8');
var configData: configuationData = JSON.parse(dataSting);

// Create Database Pool
var pool = mySql.createPool(configData.database);
console.log('Database Pool Established');

// Create Mail Transport
var transporter = nodemailer.createTransport(configData.mail);

export function getDatabasePool() {
    return pool;
}

export function getMailTransporter() {
    return transporter;
}

export function getSenderDetails() {
    return '"' + configData.senderAddress.name + '" <' + configData.senderAddress.address + '>';
}

export function getInstallPassword() {
    return configData.installPassword;
}

export class model {
    protected connectionPool: mySql.IPool;

    protected tableName: string;

    protected objectName: string;

    protected _isChanged: boolean = false;

    get isChanged(): boolean {
        return this._isChanged;
    }

    private _id: number;

    get id(): number {
        return this._id;
    }

    set id(newID: number) {
        this._id = newID;
        this._isChanged = true;
    }

    constructor() {
        this.connectionPool = pool;
    }

    Save(properties: any, callback?: (err?: Error, res?: any) => void) {
        this.connectionPool.query('UPDATE ?? SET ? WHERE `id` = ?',
            [
                this.tableName,
                properties,
                this.id
            ],
            (err, res) => {
                if (err)
                    console.log('Error Updating ' + this.objectName + ' ' + this.id + ': ' + err);
                else {
                    console.log('Updated ' + this.objectName + ': ' + this.id);
                }
                callback(err, res);
            });
    }

    LoadData(callback: (err?: Error, res?: any) => void, id?: number) {
        // Load ID if defined here
        if (id != undefined) {
            this.id = id;
        }
        // Sanity Check
        if (this.id == undefined) {
            callback(new Error('No ID defined when loading'));
            return;
        }

        this.connectionPool.query('SELECT * FROM ?? WHERE `id` = ?',
            [
                this.tableName,
                this.id
            ],
            (err, res) => {
                callback(err, res);
            });
    }

    Count(callback: (res: number, err?: Error) => void) {
        this.connectionPool.query(
            'SELECT COUNT(*) as "result" FROM ??;',
            [this.tableName],
            function (err, res, fields) {
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