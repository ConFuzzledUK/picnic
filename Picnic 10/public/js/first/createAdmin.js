/// <reference path="../../../typings/browser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var validator = require('validator');
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.apply(this, arguments);
        this.urlRoot = '/first/createadmin';
    }
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return _super.prototype.get.call(this, 'email');
        },
        set: function (value) {
            _super.prototype.set.call(this, "email", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "username", {
        get: function () {
            return _super.prototype.get.call(this, 'username');
        },
        set: function (value) {
            _super.prototype.set.call(this, "username", value);
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.validate = function (attr, options) {
        if (this.has('email')) {
            if (!validator.isEmail(this.email)) {
                return 'email';
            }
        }
    };
    return User;
})(Backbone.Model);
var CreateAdminAppView = (function (_super) {
    __extends(CreateAdminAppView, _super);
    function CreateAdminAppView() {
        _super.apply(this, arguments);
    }
    return CreateAdminAppView;
})(Backbone.View);
//# sourceMappingURL=createAdmin.js.map