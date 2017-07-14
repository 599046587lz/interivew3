const express = require('express'),
    session = require('express-session'),
    cookie = require('cookie-parser'),
    path = require('path'),
    RedisStore = require('connect-redis')(session),
    package = require('../config/package');

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


router.get('/:clubID', function (req, res) {

//     if(!!req.session.user) {
    let clubID = req.params.clubID;
    let file, filename;
    try {
        package.packing(clubID, function (err) {
            if (err) {
                throw err;
            }
            else {
                file = path.resolve(__dirname, '../files/' + clubID + '.zip');
                filename = clubID + '.zip';
                res.download(file, filename, function (err) {
                    if (err) throw err;
                });
            }
        });
    } catch (err) {
        cosole.log(err);
        res.send('打包失败，请重试！');
    }

//}
});

module.exports = router;