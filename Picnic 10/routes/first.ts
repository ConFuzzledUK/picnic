import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import services = require('../services');
import core = require('../classes/core');

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
            user.email = req.body.email;
            user.username = req.body.username;
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
            link: returnURI,
            linkText: 'Confirm E-mail and continue'
        });

        services.getMailTransporter().sendMail({
            from: services.getSenderDetails(),
            to: user.email,
            subject: 'Account Created',
            text: plainText,
            html: htmlText
        }, function (err, info) {
            console.log(err);
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
            res.render('first/password', { pageTitle: 'Picnic 10', username: user.username });
        }, req.query.code, true);
    }
    else
        res.redirect('/');
});

router.post('/password', function (req, res) {
    console.log('Set First Admin Password Submission');
    if (req.cookies.goodInstallPassword === services.getInstallPassword()) {
        // Check required are present
        if (!req.body.email || !req.body.username) {
            res.redirect('/first/createadmin'); // Bounce out if fields are missing
            return;
        }
        
        // Create User
        var user = new core.User();
        
    }
    else
        res.redirect('/');
});

export = router;
