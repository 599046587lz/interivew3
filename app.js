
const express = require('express'),
      path = require('path'),
      favicon = require('static-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session    = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      multer = require('multer'),

      club = require('./router/club'),
      interview = require('./router/interview'),
      room = require('./router/room'),
      common = require('./router/common'),
      reg = require('./router/reg'),
      download = require('./router/download');

      config = require('./config');

var app = express();
// var upload = multer({dest: '/tmp/interview'});

global.token = '57dbfcf39882410001b0c195';
//报名系统注册入口
app.use('/reg',reg);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({
    dest: '/tmp/interview'
}));
app.use(cookieParser());
app.use(session({
    secret: config.cookie_secret,
    store: new MongoStore({
        url: `mongodb://${ config.db.host }/${ config.db.db }`,
        auto_reconnect:true
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);
app.use('/common', common);
app.use('/download',download);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

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
