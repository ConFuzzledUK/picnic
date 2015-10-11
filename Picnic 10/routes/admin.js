var express = require('express');
var core = require('../classes/core');
var router = express.Router();
router.use(function (req, res, next) {
    next();
});
// Root
router.get('/', function (req, res) {
    console.log('Admin Root Request');
    res.redirect('/admin/sign-in');
});
// Sign In
router.get('/sign-in', function (req, res) {
    console.log('Admin Sign In Page Request');
    res.render('admin/sign-in', { pageTitle: 'Administration Sign In' });
});
router.post('/sign-in', function (req, res) {
    console.log('Admin Sign In Auth Request');
    // Check required fields are present
    if (!req.body.email || !req.body.password) {
        res.redirect('/admin/sign-in');
    }
    // Look up by e-mail
    var user = new core.User();
    user.GetByEmail(function (success, err) {
        if (err) {
            console.log('Error Loading user: ' + err);
            res.redirect('/admin/sign-in');
            return;
        }
        if (!success) {
            // No user found with that e-mail
            res.render('admin/sign-in', { pageTitle: 'Administration Sign In', baduserpass: true, user_email: req.body.email });
            return;
        }
        // Is an admin?
        if (user.global_admin) {
            // Compare Password
            user.ComparePassword(req.body.password, function (res, err) {
                if (err) {
                    console.log('Error Checking password: ' + err);
                    res.redirect('/admin/sign-in');
                    return;
                }
                if (res) {
                    // Good Password
                    // Set session (use checkbox to set length)
                    if (req.body.keepalive) { }
                }
                /*
                CONTIUNE:

                > Refer to express-session documentation to set up sessions using knex and connect-session-knex
                Might need to make a connect-session-knex d.ts, hopefully not
                Build future database things using knex, go back and change old ones at some point
                Continue on to showing admin home


                /*
            }

            // Perform redirect or render
        }
        else {
            // Bad password
            res.render('admin/sign-in', { pageTitle: 'Administration Sign In', baduserpass: true, user_email: req.body.email });
        return;
    }
    });
} else {
    // Not an admin
    res.redirect('/admin/sign-in');
}

}, req.body.email);
});


export = router;
                 });
        }
        /*
        CONTIUNE:

        > Refer to express-session documentation to set up sessions using knex and connect-session-knex
        Might need to make a connect-session-knex d.ts, hopefully not
        Build future database things using knex, go back and change old ones at some point
        Continue on to showing admin home


        /*
    }

    // Perform redirect or render
}
else {
    // Bad password
    res.render('admin/sign-in', { pageTitle: 'Administration Sign In', baduserpass: true, user_email: req.body.email });
return;
}
});
} else {
// Not an admin
res.redirect('/admin/sign-in');
}

}, req.body.email);
});


export = router;
         });
    /*
    CONTIUNE:

    > Refer to express-session documentation to set up sessions using knex and connect-session-knex
    Might need to make a connect-session-knex d.ts, hopefully not
    Build future database things using knex, go back and change old ones at some point
    Continue on to showing admin home


    /*
}

// Perform redirect or render
}
else {
// Bad password
res.render('admin/sign-in', { pageTitle: 'Administration Sign In', baduserpass: true, user_email: req.body.email });
return;
}
});
} else {
// Not an admin
res.redirect('/admin/sign-in');
}

}, req.body.email);
});


export = router;
     });
/*
CONTIUNE:

> Refer to express-session documentation to set up sessions using knex and connect-session-knex
Might need to make a connect-session-knex d.ts, hopefully not
Build future database things using knex, go back and change old ones at some point
Continue on to showing admin home


/*
}

// Perform redirect or render
}
else {
// Bad password
res.render('admin/sign-in', { pageTitle: 'Administration Sign In', baduserpass: true, user_email: req.body.email });
return;
}
});
} else {
// Not an admin
res.redirect('/admin/sign-in');
}

}, req.body.email);
});


export = router;
 
//# sourceMappingURL=admin.js.map