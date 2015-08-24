/// <reference path="../../../typings/browser.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UserModel = (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        _super.apply(this, arguments);
        this.urlRoot = '/first/createadmin';
    }
    Object.defineProperty(UserModel.prototype, "email", {
        get: function () {
            return _super.prototype.get.call(this, 'email');
        },
        set: function (value) {
            _super.prototype.set.call(this, "email", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserModel.prototype, "username", {
        get: function () {
            return _super.prototype.get.call(this, 'username');
        },
        set: function (value) {
            _super.prototype.set.call(this, "username", value);
        },
        enumerable: true,
        configurable: true
    });
    return UserModel;
})(Backbone.Model);
var userData = new UserModel();
var CreateAdminAppView = (function (_super) {
    __extends(CreateAdminAppView, _super);
    function CreateAdminAppView(options) {
        _super.call(this, options);
        this.events = {
            'blur input': 'update',
            'submit': 'doSubmit' // Refer to root element with just an event name
        };
        this.setElement($('#createAdminForm'), true);
        this.model = userData;
    }
    CreateAdminAppView.prototype.update = function () {
        this.model.email = $('#email').val();
        this.model.username = $('#username').val();
    };
    CreateAdminAppView.prototype.doSubmit = function (event) {
        //event.preventDefault();
        //return false;
        // For now use standard submission
    };
    return CreateAdminAppView;
})(Backbone.View);
$(function () {
    new CreateAdminAppView();
});
//# sourceMappingURL=createAdmin.js.map