
const express = require('express'),
      student = require('../db/student');

var router = express.Router();


//
// router.get('/info/:code', function (req, res, next){
//     var data = req.params.code;
//     //查询数据库,有没有该社团code，返回社团名
//     if (//没有)  res.sendStatus(403);
//     else res.send(//查询结果);
// });

router.post('/info', function (req, res, next) {

    var data = req.body;
    var send;
    (async() => {
        try {
            send = await student.addStudent(data);
            return res.send(send.image);
        } catch (err) {
            return res.sendStatus(403);
        }
    })();
});
module.exports = router;