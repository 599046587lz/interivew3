const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const favicon = require('static-favicon');
const logger = require('morgan'); //
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const club = require('./router/club');
const interview = require('./router/interview');
const room = require('./router/room');
const common = require('./router/common');
const reg = require('./router/reg');
const mid = require('./utils/middleware');
const config = require('./config');
const utils = require('./utils/utils');
const app = express();

utils.saveDb();
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.ENABLE_PROXY) {
    app.use(proxy({ target: config.proxy, changeOrigin: true }))
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(favicon());
if(config.environment === 'debug'){
    app.use(logger('dev'));
}

// app.all('*', function(req, res, next) {//允许全部跨域
//
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization,'Origin',Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Content-Type", "application/json;charset=utf-8");
//     //console.log('------')
//     next();
// });



app.use(mid.session());
//报名系统公共入口（不需登录）
app.use('/common', common);
app.use('/reg',reg);
//进行是否登录的鉴定
app.use(mid.checkLogin)
app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err);
});


module.exports = app;
