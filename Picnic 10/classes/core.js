var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var db = require('../db');
var s = require("underscore.string");
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
        this.connectionPool = db.getPool();
        audit.auditor = this;
    }
    audit.save = function (event, type, actor, target) {
        if (type === void 0) { type = AuditTypes.System; }
        if (actor === void 0) { actor = 0; }
        if (target === void 0) { target = 0; }
        if (audit.auditor == undefined) {
            throw "Auditor Not Ready";
        }
        console.log('Audit: ' + s.join(' - ', event, AuditTypes[type], actor.toString(), target.toString()));
        audit.auditor.connectionPool.query('INSERT INTO audit SET ?', { type: type, details: event, actor: actor, target: target }, function (err) {
            if (err)
                console.log('Unable to save audit: ' + err);
        });
    };
    return audit;
})();
exports.audit = audit;
var user = (function (_super) {
    __extends(user, _super);
    function user() {
        _super.call(this);
        this.tableName = 'users';
    }
    return user;
})(db.model);
exports.user = user;
//# sourceMappingURL=core.js.map