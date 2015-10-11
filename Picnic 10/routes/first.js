var express = require('express');
var _ = require("underscore.string");
var services = require('../services');
var core = require('../classes/core');
var router = express.Router();
// First check we are in a first run state with no users
router.use(function (req, res, next) {
    var user = new core.User();
    user.CountActiveAdmins(function (count) {
        if (count == 0) {
            console.log('No Admins Found');
            next();
        }
        else {
            res.redirect('/');
        }
    });
});
// Install Password
router.get('/', function (req, res) {
    console.log('First Password Page Request');
    res.render('first/installPassword', { pageTitle: 'Picnic 10' });
});
router.post('/', function (req, res) {
    console.log('First Password Page Check');
    if (req.body.password === services.getInstallPassword()) {
        // Redirect
        res.cookie('goodInstallPassword', req.body.password, {
            maxAge: 900000,
            httpOnly: true
        });
        res.redirect('/first/createadmin');
        return;
    }
    else {
        res.render('first/installPassword', { pageTitle: 'Picnic 10', wrongPassword: true });
    }
});
// First Admin
router.get('/createadmin', function (req, res) {
    console.log('Create First Admin Page Request');
    // Check password in cookie
    if (req.cookies.goodInstallPassword === services.getInstallPassword()) {
        res.render('first/createadmin', { pageTitle: 'Picnic 10' });
        return;
    }
    else
        res.redirect('/');
});
router.post('/createadmin', function (req, res) {
    console.log('Create First Admin Submission');
    if (req.cookies.goodInstallPassword === services.getInstallPassword()) {
        // Check required are present
        if (!req.body.email || !req.body.username) {
            res.redirect('/first/createadmin'); // Bounce out if fields are missing
            return;
        }
        // Create User
        var user = new core.User();
        try {
            user.email = _.trim(req.body.email);
            user.username = _.trim(req.body.username);
        }
        catch (fault) {
            console.log(fault);
            res.redirect('/first/createadmin'); // Bounce out if fields are invalid
            return;
        }
        user.global_admin = true;
        var uuid = user.Create(function (err, res) {
            if (!err)
                core.audit.save("Created Global Admin: " + user.username, core.AuditTypes.Security, res.insertId, res.insertId);
        });
        // Send E-mail
        var args = process.argv.slice(2); // For checking dev state
        var returnURI = ((req.secure) ? 'https' : 'http') + '://' +
            req.hostname + ((args[0] == 'dev') ? ':1337' : '') +
            '/first/password?code=' + uuid;
        var plainText = 'Hello ' + user.username + '! Your account on Picnic 10 has been created. Go to '
            + returnURI +
            ' to confirm your e-mail account and set your password.';
        var jade = require('jade');
        var htmlText = jade.renderFile('email/email_system.jade', {
            title: 'Welcome ' + user.username + '!',
            body: "Your account on Picnic 10 has been created. To finish up, you'll need to click this button and then set your password.",
            action: returnURI,
            linkText: 'Confirm E-mail and continue'
        });
        services.getMailTransporter().sendMail({
            from: services.getSenderDetails(),
            to: user.email,
            subject: 'Account Created',
            text: plainText,
            html: htmlText
        }, function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log(info.response);
        });
        // Redirect to complete page
        res.redirect('/first/emailsent');
    }
    else
        res.redirect('/');
});
// E-mail Sent
router.get('/emailsent', function (req, res) {
    console.log('First Admin E-mail Sent Page Request');
    res.render('first/sentemail', { pageTitle: 'Picnic 10' });
});
// Set Password
router.get('/password', function (req, res) {
    console.log('Set First Admin Password Page Request');
    // Check code in GET data
    if (req.query.code) {
        var user = new core.User();
        user.GetByEmailCode(function (foundResult, err) {
            if (foundResult) {
                res.render('first/password', { pageTitle: 'Picnic 10', username: user.username, email_code: req.query.code, err: req.query.err });
            }
            else {
                res.render('first/bad_code', { pageTitle: 'Picnic 10' });
            }
        }, req.query.code, true);
    }
    else
        res.redirect('/');
});
router.post('/password', function (req, res) {
    console.log('Set First Admin Password Submission');
    // Check required are present
    if (!req.body.code || !req.body.password || !req.body.confirm) {
        res.redirect('/first/password'); // Bounce out if fields are missing
        return;
    }
    // Check E-mail Code and load user
    var user = new core.User();
    user.GetByEmailCode(function (foundResult, err) {
        if (foundResult) {
            // Check passwords match
            if (req.body.password != req.body.confirm) {
                res.redirect('/first/password?err=mismatch&code=' + req.body.code);
                return;
            }
            else if (req.body.password.length < 10) {
                res.redirect('/first/password?err=short&code=' + req.body.code);
                return;
            }
            else {
                // Set Properties, Save and Continue
                try {
                    user.SetPassword(req.body.password, function () {
                        user.email_code = null;
                        user.email_code_date = null;
                        user.status = core.userStatus.Active;
                        user.Save(function (err, res) {
                            if (err) {
                                core.audit.save("Error while saving password for global admin: " + user.username, core.AuditTypes.Security, user.id, user.id);
                                return;
                            }
                            // Audit
                            core.audit.save("Password First Set for Global Admin: " + user.username, core.AuditTypes.Security, user.id, user.id);
                            // Send success e-mail
                            var args = process.argv.slice(2); // For checking dev state
                            var returnURI = ((req.secure) ? 'https' : 'http') + '://' +
                                req.hostname + ((args[0] == 'dev') ? ':1337' : '') +
                                '/admin/sign-in';
                            var plainText = 'Hello ' + user.username + '! Your password on Picnic 10 has been set. Go to '
                                + returnURI +
                                ' to sign in at any time.';
                            var jade = require('jade');
                            var htmlText = jade.renderFile('email/email_system.jade', {
                                title: "You're all setup!",
                                body: "Your password for Picnic 10 has now been set. You can now sign in to the administration panel.",
                                link: returnURI,
                                linkText: 'Go to Sign In'
                            });
                            services.getMailTransporter().sendMail({
                                from: services.getSenderDetails(),
                                to: user.email,
                                subject: 'Account Setup Complete',
                                text: plainText,
                                html: htmlText
                            }, function (err, info) {
                                console.log(err);
                                console.log(info.response);
                            });
                        });
                    });
                }
                catch (fault) {
                    console.log('Error while finalising first user: ' + fault);
                    res.send('Error');
                }
                // Render complete
                res.render('first/complete', { pageTitle: 'Picnic 10' });
            }
        }
        else
            res.redirect('/');
    }, req.body.code, true);
});
module.exports = router;
//# sourceMappingURL=first.js.map