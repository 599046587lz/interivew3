let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let config = require('../config');

exports.checkLogin = function (req, res, next){
    if (!!req.session['cid']){
        next();
    } else {
        res.send(403, 'Require Login');
    }
};

exports.session = function() {
    return session({
        secret: config.cookie_secret,
        store: new MongoStore({
            url: `mongodb://${ config.db.host }/${ config.db.db }`,
            auto_reconnect:true
        }),
        resave: true,
        saveUninitialized: true
    });
};
