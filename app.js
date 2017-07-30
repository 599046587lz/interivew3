let express = require('express');
let path = require('path');
let favicon = require('static-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let club = require('./routes/club');
let interview = require('./routes/interview');
let room = require('./routes/room');
let common = require('./routes/common');
let mid = require('./utils/middleware');
let app = express();
let config = require('./config');

global.token = '57dbfcf39882410001b0c195';

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser());
app.use(mid.session());

app.use('/club', club);
app.use('/interview', interview);
app.use('/room', room);
app.use('/common', common);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 400);
    console.log(err.message);
    res.send(err.message);
});


module.exports = app;
