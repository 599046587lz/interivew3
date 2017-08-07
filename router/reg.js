const express = require('express'),
    student = require('../modules/student'),
    image_save = require('../utils/image_save'),
    club = require('../modules/club');

let router = express.Router();

let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/', wrap(async function (req, res, next) {
        let data = req.body;
        let result;
        if (!data || !!Object.keys(data).length == 0) throw new Error('数据丢包，请重新输入！');
        else {
            let info = {};

            info.name = data.club;
            info.cid = data.clubID;
            result = await club.verifyInfo(info);
            let filename = Date.now() + '.jpg';
            let newfilename = 'new' + filename;
            image_save.image_save(data.pic_url, filename, newfilename);
            data.image = newfilename;
            result = await student.addStudent(data);

            res.send(result);
        }
    }
));
module.exports = router;