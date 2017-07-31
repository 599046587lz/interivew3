
const express = require('express'),
      path = require('path'),
      favicon = require('static-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      club = require('./router/club'),
      interview = require('./router/interview'),
      room = require('./router/room'),
      common = require('./router/common'),
      reg = require('./router/reg'),
      download = require('./router/download');
      mid = require('./utils/middleware');
      config = require('./config');

let app = express();

global.token = '57dbfcf39882410001b0c195';


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser());

app.use(cookieParser());
app.use(mid.session());
app.use(express.static(path.join(__dirname, 'public')));

//报名系统注册入口
app.use('/reg',reg);
app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);
app.use('/common', common);
app.use('/download',download);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
