import mySql = require('mysql');
import services = require('../services');
import _ = require("underscore.string");
import uuid = require("node-uuid");
import moment = require("moment");

export enum AuditTypes { 'System', 'Security', 'Payment', 'Data' };

// Performs logging operations to the database
export class audit {
    private connectionPool: mySql.IPool;

    static auditor: audit;

    static save(event: string, type: AuditTypes = AuditTypes.System, actor: number = 0, target: number = 0) {
        if (audit.auditor == undefined) {
            throw "Auditor Not Ready";
        }

        console.log('Audit: ' + _.join(' - ', event, AuditTypes[type], actor.toString(), target.toString()));

        audit.auditor.connectionPool.query('INSERT INTO audit SET ?',
            { type: type, details: event, actor: actor, target: target },
            function (err) {
                if (err)
                    console.log('Unable to save audit: ' + err);
            });
    }

    constructor() {
        this.connectionPool = services.getDatabasePool();
        audit.auditor = this;
    }
}

export enum userStatus {
    New,
    Active,
    Disabled
}

export class User extends services.model {

    private _email: string;
    get email(): string {
        return this._email;
    }
    set email(newValue: string) {
        if (_.include(newValue, '@')) {
            this._email = newValue;
            this._isChanged = true;
        }
        else throw new Error('Invalid E-mail Address');
    }

    private _password: string;
    get password(): string {
        return this._password;
    }
    set password(newValue: string) {
        if (newValue.length < 10)
            throw new Error('Password too short');
        else {

            this._password = newValue;
            this._isChanged = true;
        }
    }

    private _username: string;
    get username(): string {
        return this._username;
    }
    set username(newValue: string) {
        this._username = newValue;
        this._isChanged = true;
    }

    private _date_created: Date;
    get date_created(): Date {
        return this._date_created;
    }
    set date_created(newValue: Date) {
        this._date_created = newValue;
        this._isChanged = true;
    }

    private _date_updated: Date;
    get date_updated(): Date {
        return this._date_updated;
    }
    set date_updated(newValue: Date) {
        this._date_updated = newValue;
        this._isChanged = true;
    }

    private _email_code: string;
    get email_code(): string {
        return this._email_code;
    }
    set email_code(newValue: string) {
        this._email_code = newValue;
        this._isChanged = true;
    }

    private _email_code_date: Date;
    get email_code_date(): Date {
        return this._email_code_date;
    }
    set email_code_date(newValue: Date) {
        this._email_code_date = newValue;
        this._isChanged = true;
    }

    private _status: userStatus;
    get status(): userStatus {
        return this._status;
    }
    set status(newValue: userStatus) {
        this._status = newValue;
        this._isChanged = true;
    }

    private _global_admin: boolean;
    get global_admin(): boolean {
        return this._global_admin;
    }
    set global_admin(newValue: boolean) {
        this._global_admin = newValue;
        this._isChanged = true;
    }

    constructor() {
        super();
        this.tableName = 'users';
        this.objectName = 'User';
    }

    Create(callback?: (err?: Error, res?: any) => void): string {
        this.email_code = uuid.v4();

        this.email_code_date = new Date();

        this.status = userStatus.New;
        // Start saving...
        this.connectionPool.query('INSERT INTO users SET ?',
            {
                email: this.email,
                username: this.username,
                password: null,
                email_code: this.email_code,
                email_code_date: this.email_code_date,
                status: this.status,
                global_admin: this.global_admin
            },
            (err, res) => {
                if (err)
                    console.log('Error Creating User: ' + err);
                else {
                    console.log('Created User: ' + res.insertId);
                    this.id = res.insertId;
                }
                callback(err, res);
            });
        // Assume things will go well and return the code so we can continue with other operations
        return this.email_code;
    }

    Load(callback: (res?: boolean, err?: Error) => void, id?: number) {
        super.LoadData((err, results: Array<any>) => {
            // Internal Error
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
                return;
            }
            // Sanity Check
            if (results.length > 1) {
                throw new Error('Error: Load returned more than one result');
            }
            // Found record
            if (results.length == 1) {
                for (var field in results[0]) {
                    this[field] = results[0][field];
                }
                this._isChanged = false;
                console.log('Loaded User: ' + this.id);
                callback(true);
            }
            // No Results
            if (results.length == 0) {
                callback(false);
            }
        }, id);
    }

    Save(callback: (err?: Error, res?: any) => void) {
        super.Save({
            email: this.email,
            username: this.username,
            password: null,
            email_code: this.email_code,
            email_code_date: this.email_code_date,
            status: this.status,
            global_admin: this.global_admin
        }, callback);
    }

    CountActiveAdmins(callback: (res: number, err?: Error) => void) {
        this.connectionPool.query('SELECT COUNT(*) as "result" FROM users WHERE global_admin = 1 AND status = ?;', [userStatus.Active], function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                callback(res[0].result);
            }
        });
    }

    GetByEmailCode(callback: (recordFound: boolean, err?: Error) => void, code: string, ignoreTime: boolean = false) {
        if (ignoreTime) {
            var q = "SELECT * from users WHERE email_code = ? LIMIT 1";
            var params = <any>[code];
        }
        else {
            var q = "SELECT * from users WHERE email_code = ? AND email_code_time = ? LIMIT 1";
            var oneHourAgo = moment().subtract('hour', 1);
            var params = <any>[code, oneHourAgo.toDate()];
        }
        this.connectionPool.query(q, params, (err, res: Array<User>, fields) => {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                if (res.length == 1) {
                    for (var field in res[0]) {
                        this[field] = res[0][field];
                    }
                    this._isChanged = false;
                    callback(true);
                }
                else
                    callback(false);
            }
        });
    }
}