//
// const express = require('express'),
//       session = require('express-session'),
//       cookie= require('cookie-parser'),
//       RedisStore = require('connect-redis')(session);
//
// var router = express.Router();
//
// router.use('/',function(req,res,next){
//
//         if( req.body.user && req.body.password )next();
//         else res.send('403');
//     },
//     function (req,res,next) {
//         //查询数据库密码账号是否正确
//         next();
//     });
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
//
// router.post('/login',function(req,res,next){
//
//         req.session.user = req.body.user;
//         res.send(req.session);
// });
//
// module.exports = router;