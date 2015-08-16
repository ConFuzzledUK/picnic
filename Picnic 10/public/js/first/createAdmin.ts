/// <reference path="../../../typings/browser.d.ts" />

import validator = require('validator');

class User extends Backbone.Model {
    get email(): string {
        return super.get('email');
    }

    set email(value: string) {
        super.set("email", value);
    }

    get username(): string {
        return super.get('username');
    }

    set username(value: string) {
        super.set("username", value);
    }

    validate(attr, options) {
        if (this.has('email')) {
            if (!validator.isEmail(this.email)) {
                return 'email';
            }
        }
    }

    urlRoot = '/first/createadmin';
}

class CreateAdminAppView extends Backbone.View<User> {
    model: User;

    // CONTINUE: Finish View
}