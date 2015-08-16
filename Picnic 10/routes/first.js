var express = require('express');
var db = require('../db');
var core = require('../classes/core');
var router = express.Router();
// First check we are in a first run state with no users
router.use(function (req, res, next) {
    var user = new core.user();
    user.Count(function (count) {
        if (count == 0) {
            console.log('No Users Found');
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
    if (req.body.password == db.getInstallPassword()) {
        // Redirect
        res.cookie('goodInstallPassword', req.body.password, {
            maxAge: 900000 // 15 minutes
        });
        res.redirect('/first/createadmin');
    }
    else {
        res.render('first/installPassword', { pageTitle: 'Picnic 10', wrongPassword: true });
    }
});
// First Admin
router.get('/createadmin', function (req, res) {
    console.log('Create First Admin Page Request');
    // Check password in cookie
    if (req.cookies.goodInstallPassword === db.getInstallPassword()) {
        res.render('first/createadmin', { pageTitle: 'Picnic 10' });
    }
    else
        res.redirect('/');
});
module.exports = router;
//# sourceMappingURL=first.js.map