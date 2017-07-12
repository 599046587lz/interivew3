
const express = require('express'),
    session = require('express-session'),
    cookie= require('cookie-parser'),
    path = require('path'),
    RedisStore = require('connect-redis')(session),
    config = require('../config');

var router = express.Router();

//
// router.use(session({
//     store: new RedisStore({
//         host: '127.0.0.1',
//         port: '6379'
//     }),
//     secret:'bpEiknxZzbOYvQAdWiEizpAN5o4QE5Ca6sGqbm0W006EpTC6iL0Q0ovIDZ4cqdQfVJXXEiIn0wwnoG8HaI4CQdbtUODYamB2OiwmjiRCvkYL0gSD4m7KExp7IqWrU3in',
//     key: 'session_id',
//     cookie: {
//         path: '/login',
//         maxAge: 10*60*1000,
//         httpOnly: true
//     }
// }));


router.get('/:code', function (req, res) {

//     if(!!req.session.user) {
        let code = req.params.code;
        let file,filename;
       config.pack(code,function(err) {
           if(err){
               console.log(err);
               res.sendStatus('403');
           }
           else{
               file = path.resolve(__dirname, '../files/' + code + '.zip');
               filename = code +'.zip';
               res.download(file,filename,function(err){
                   if(err)console.log(err);
               });
           }
       });
//}
});

module.exports = router;