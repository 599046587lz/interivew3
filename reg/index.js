
const express = require('express'),
      reg = require('./router/reg'),
      login = require('./router/login'),
      upload = require('./router/upload'),
      bodyParser = require('body-parser'),
      download = require('./router/download');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/reg',reg);
app.use('/login/download',download);
//app.use('/login',login);
//app.use('/upload',upload);

app.listen(3000);