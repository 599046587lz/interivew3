let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let config = require('../config');
let Joi = require('joi');
let mongoUrl = require('../models').mongoUrl;

exports.checkLogin = function (req, res, next){
    if (!!req.session['cid']){
        next();
    } else {
        res.status(403).send('Require Login');
    }
};

exports.session = function() {
    return session({
        secret: config.cookie_secret,
        store: new MongoStore({
            url: mongoUrl,
            auto_reconnect:true
        }),
        resave: true,
        saveUninitialized: true
    });
};


exports.checkFormat = function(format, option) {
    let errInfo;
    let joiFormat = format();
    if(joiFormat.errInfo) {
        errInfo = joiFormat.errInfo;
        joiFormat = joiFormat.joi;
    }

    return function(req, res, next) {
        let body;
        if (req.method === 'GET' || req.method === 'DELETE') {
            body = Object.assign({}, req.query, req.params);
        } else {
            body = Object.assign({}, req.body, req.params);
        }

        let result = Joi.validate(body, joiFormat, option);
        if(result.error) {
            console.log(result.error);
            let re = /(")([\u4E00-\u9FA5A-Za-z0-9_]+)(")/;
            let error = re.exec(result.error)[2];
            if(errInfo && errInfo[error]) {
                return res.status(400).send(errInfo[error] + '格式错误');
            }
            return res.status(400).send('参数类型不合法');
        }
        next();
    }
};
