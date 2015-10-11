var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var services = require('../services');
var _ = require("underscore.string");
var uuid = require("node-uuid");
var moment = require("moment");
var bcrypt = require("bcryptjs");
(function (AuditTypes) {
    AuditTypes[AuditTypes['System'] = 0] = 'System';
    AuditTypes[AuditTypes['Security'] = 1] = 'Security';
    AuditTypes[AuditTypes['Payment'] = 2] = 'Payment';
    AuditTypes[AuditTypes['Data'] = 3] = 'Data';
})(exports.AuditTypes || (exports.AuditTypes = {}));
var AuditTypes = exports.AuditTypes;
;
// Performs logging operations to the database
var audit = (function () {
    function audit() {
        this.connectionPool = services.getDatabasePool();
        audit.auditor = this;
    }
    audit.save = function (event, type, actor, target) {
        if (type === void 0) { type = AuditTypes.System; }
        if (actor === void 0) { actor = 0; }
        if (target === void 0) { target = 0; }
        if (audit.auditor == undefined) {
            throw "Auditor Not Ready";
        }
        console.log('Audit: ' + _.join(' - ', event, AuditTypes[type], actor.toString(), target.toString()));
        audit.auditor.connectionPool.query('INSERT INTO audit SET ?', { type: type, details: event, actor: actor, target: target }, function (err) {
            if (err)
                console.log('Unable to save audit: ' + err);
        });
    };
    return audit;
})();
exports.audit = audit;
(function (userStatus) {
    userStatus[userStatus["New"] = 0] = "New";
    userStatus[userStatus["Active"] = 1] = "Active";
    userStatus[userStatus["Disabled"] = 2] = "Disabled";
})(exports.userStatus || (exports.userStatus = {}));
var userStatus = exports.userStatus;
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.call(this);
        this.tableName = 'users';
        this.objectName = 'User';
    }
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (newValue) {
            if (_.include(newValue, '@')) {
                this._email = newValue;
                this._isChanged = true;
            }
            else
                throw new Error('Invalid E-mail Address');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (newValue) {
            this._password = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (newValue) {
            this._username = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "date_created", {
        get: function () {
            return this._date_created;
        },
        set: function (newValue) {
            this._date_created = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "date_updated", {
        get: function () {
            return this._date_updated;
        },
        set: function (newValue) {
            this._date_updated = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email_code", {
        get: function () {
            return this._email_code;
        },
        set: function (newValue) {
            this._email_code = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email_code_date", {
        get: function () {
            return this._email_code_date;
        },
        set: function (newValue) {
            this._email_code_date = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (newValue) {
            this._status = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "global_admin", {
        get: function () {
            return this._global_admin;
        },
        set: function (newValue) {
            this._global_admin = newValue;
            this._isChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.Create = function (callback) {
        var _this = this;
        this.email_code = uuid.v4();
        this.email_code_date = new Date();
        this.status = userStatus.New;
        // Start saving...
        this.connectionPool.query('INSERT INTO users SET ?', {
            email: this.email,
            username: this.username,
            password: null,
            email_code: this.email_code,
            email_code_date: this.email_code_date,
            status: this.status,
            global_admin: this.global_admin
        }, function (err, res) {
            if (err)
                console.log('Error Creating User: ' + err);
            else {
                console.log('Created User: ' + res.insertId);
                _this.id = res.insertId;
            }
            callback(err, res);
        });
        // Assume things will go well and return the code so we can continue with other operations
        return this.email_code;
    };
    User.prototype.Load = function (callback, id) {
        var _this = this;
        _super.prototype.LoadData.call(this, function (err, results) {
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
                    _this[field] = results[0][field];
                }
                _this._isChanged = false;
                console.log('Loaded User: ' + _this.id);
                callback(true);
            }
            // No Results
            if (results.length == 0) {
                callback(false);
            }
        }, id);
    };
    User.prototype.Save = function (callback) {
        _super.prototype.Save.call(this, {
            email: this.email,
            username: this.username,
            password: this.password,
            email_code: this.email_code,
            email_code_date: this.email_code_date,
            status: this.status,
            global_admin: this.global_admin
        }, callback);
    };
    User.prototype.CountActiveAdmins = function (callback) {
        this.connectionPool.query('SELECT COUNT(*) as "result" FROM users WHERE global_admin = 1 AND status = ?;', [userStatus.Active], function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                callback(res[0].result);
            }
        });
    };
    User.prototype.GetByEmailCode = function (callback, code, ignoreTime) {
        var _this = this;
        if (ignoreTime === void 0) { ignoreTime = false; }
        if (ignoreTime) {
            var q = "SELECT * from users WHERE email_code = ? LIMIT 1";
            var params = [code];
        }
        else {
            var q = "SELECT * from users WHERE email_code = ? AND email_code_time = ? LIMIT 1";
            var oneHourAgo = moment().subtract('hour', 1);
            var params = [code, oneHourAgo.toDate()];
        }
        this.connectionPool.query(q, params, function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                if (res.length == 1) {
                    for (var field in res[0]) {
                        _this[field] = res[0][field];
                    }
                    _this._isChanged = false;
                    callback(true);
                }
                else
                    callback(false);
            }
        });
    };
    User.prototype.GetByEmail = function (callback, email, ignoreStatus) {
        var _this = this;
        if (ignoreStatus === void 0) { ignoreStatus = false; }
        if (ignoreStatus) {
            var q = "SELECT * from users WHERE email = ? LIMIT 1";
            var params = [email];
        }
        else {
            var q = "SELECT * from users WHERE email_code = ? AND status = ? LIMIT 1";
            var params = [email, userStatus.Active];
        }
        this.connectionPool.query(q, params, function (err, res, fields) {
            if (err) {
                console.log('Database Error: ' + err);
                callback(undefined, err);
            }
            else {
                if (res.length == 1) {
                    for (var field in res[0]) {
                        _this[field] = res[0][field];
                    }
                    _this._isChanged = false;
                    callback(true);
                }
                else
                    callback(false);
            }
        });
    };
    User.prototype.SetPassword = function (clear, callback) {
        var _this = this;
        var startTime = new Date().getTime();
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                throw new Error('Error while generating Salt');
            }
            bcrypt.hash(clear, salt, function (err, encryptedString) {
                if (err) {
                    throw new Error('Error while hashing password');
                }
                _this.password = encryptedString;
                var elapsed = new Date().getTime() - startTime;
                console.log('Encrypted Password in:' + elapsed + 'ms');
                callback();
            });
        });
    };
    User.prototype.ComparePassword = function (challange, callback) {
        var startTime = new Date().getTime();
        bcrypt.compare(challange, this.password, function (err, res) {
            var elapsed = new Date().getTime() - startTime;
            console.log('Compared Password in:' + elapsed + 'ms');
            callback(res, err);
        });
    };
    return User;
})(services.model);
exports.User = User;
//# sourceMappingURL=core.js.map