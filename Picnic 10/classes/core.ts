import mySql = require('mysql');
import db = require('../db');
import s = require("underscore.string");

export enum AuditTypes { 'System', 'Security', 'Payment', 'Data' };

// Performs logging operations to the database
export class audit {
    private connectionPool: mySql.IPool;

    static auditor: audit;

    static save(event: string, type: AuditTypes = AuditTypes.System, actor: number = 0, target: number = 0) {
        if (audit.auditor == undefined) {
            throw "Auditor Not Ready";
        }

        console.log('Audit: ' + s.join(' - ', event, AuditTypes[type], actor.toString(), target.toString()));

        audit.auditor.connectionPool.query('INSERT INTO audit SET ?',
            { type: type, details: event, actor: actor, target: target },
            function (err) {
                if (err)
                    console.log('Unable to save audit: ' + err);
            });
    }

    constructor() {
        this.connectionPool = db.getPool();
        audit.auditor = this;
    }
}

export class user extends db.model {

    constructor() {
        super();
        this.tableName = 'users';
    }
    
}