let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let config = require('../config');
let Joi = require('joi');
let mongoUrl = require('../models').mongoUrl

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


// exports.checkFormat = function(format, option) {
//     let errInfo;
//     let joiFormat = format();
//     if(joiFormat.errInfo) {
//         errInfo = joiFormat.errInfo;
//         joiFormat = joiFormat.joi;
//     }
//
//     return function(req, res, next) {
//         let body;
//         if (req.method === 'GET' || req.method === 'DELETE') {
//             body = Object.assign({}, req.query, req.params);
//         } else {
//             body = Object.assign({}, req.body, req.params);
//         }
//
//         let result = Joi.validate(body, joiFormat, option);
//         if(result.error) {
//             console.log(result.error)
//             let re = /(")([\u4E00-\u9FA5A-Za-z0-9_]+)(")/;
//             let error = re.exec(result.error)[2];
//             if(errInfo && errInfo[error]) {
//                 return res.status(400).send(errInfo[error] + '格式错误');
//             }
//             return res.status(400).send('参数类型不合法');
//         }
//         next();
//     }
// };

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
            console.log(result.error)
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


// exports.checkFormat = function(format, option) {
//     let errInfo;
//     let joiFormat = format();
//     if(joiFormat.errInfo) {
//         errInfo = joiFormat.errInfo;
//         joiFormat = joiFormat.joi;
//     }
//
//     return function(ctx, next) {
//         let body;
//         if (ctx.req.method === 'GET' || ctx.req.method === 'DELETE') {
//             body = Object.assign({}, ctx.req.query, ctx.req.params);
//         } else {
//             body = Object.assign({}, ctx.req.body, ctx.req.params);
//         }
//
//         let result = Joi.validate(body, joiFormat, option);
//         if(result.error) {
//             console.log(result.error)
//             let re = /(")([\u4E00-\u9FA5A-Za-z0-9_]+)(")/;
//             let error = re.exec(result.error)[2];
//             if(errInfo && errInfo[error]) {
//                 ctx.res.status = 400;
//                 ctx.res.send(errInfo[error] + '格式错误');
//             }
//             ctx.res.status = 400;
//            // ctx.res.send('参数类型不合法');
//             ctx.res.body = '参数类型不合法';
//         }
//         //next();
//     }
// };
//
