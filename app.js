
const express = require('express');
const path = require('path');
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

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(favicon());
app.use(logger('dev'));

app.use(mid.session());
app.use(express.static(path.join(__dirname, 'public')));
//报名系统注册入口
app.use('/reg',reg);
app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);
app.use('/common', common);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.send(err.message);
});


module.exports = app;
