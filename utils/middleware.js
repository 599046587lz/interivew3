let session = require('koa-session');
let MongoStore = require('koa-session-mongo');
let config = require('../config');
let Joi = require('joi');
let mongoUrl = require('../models').mongoUrl

exports.checkLogin = async function (ctx, next){
    if (!!ctx.session.cid){
        await next();
    } else {
        ctx.response.status = 403;
        ctx.response.body = 'Require Login';

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

    return async function(ctx, next) {
        let body;
        if (ctx.request.method === 'GET' || ctx.request.method === 'DELETE') {
            body = Object.assign({}, ctx.request.query, ctx.request.params);
        } else {
            body = Object.assign({}, ctx.request.body, ctx.request.params);
        }

        let result = Joi.validate(body, joiFormat, option);
        if(result.error) {
            let re = /(")([\u4E00-\u9FA5A-Za-z0-9_]+)(")/;
            let error = re.exec(result.error)[2];
            if(errInfo && errInfo[error]) {
                ctx.response.status = 400;
                ctx.response.body = errInfo[error] + '格式错误';
                return ctx.response;
            }
            ctx.response.status = 400 ;
            ctx.response.body = '参数类型不合法';
            return ctx.response;
        }
        await next();
    }
};
