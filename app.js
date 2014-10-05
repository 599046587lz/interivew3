var express = require('express');
var path = require('path');
var favicon = require('_static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);

var club = require('./routes/club');
var interview = require('./routes/interview');
var room = require('./routes/room');

var app = express();
var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: config.cookie_secret,
    store: new MongoStore({
        db : config.db.db,
        host: config.db.host
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin','*');
    next();
});

app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
