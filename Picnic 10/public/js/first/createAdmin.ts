/// <reference path="../../../typings/browser.d.ts" />

class UserModel extends Backbone.Model {
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

    urlRoot = '/first/createadmin';
}

var userData = new UserModel();

class CreateAdminAppView extends Backbone.View<UserModel> {
    model: UserModel;

    constructor(options?) {
        super(options);

        this.events = <any> {
            'blur input': 'update',
            'submit': 'doSubmit' // Refer to root element with just an event name
        };

        this.setElement($('#createAdminForm'), true);

        this.model = userData;
    }

    update() {
        this.model.email = $('#email').val();
        this.model.username = $('#username').val();
    }
    
    doSubmit(event) {
        //event.preventDefault();
        //return false;
        // For now use standard submission
    }
}

$(() => {
    new CreateAdminAppView();
});