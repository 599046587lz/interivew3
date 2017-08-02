const express = require('express'),
    student = require('../modules/student'),
    image_save = require('../utils/image_save'),
    club = require('../modules/club');

let router = express.Router();


router.use('/', function (req, res, next) {
    let data = req.body;
    if (!data) res.sendStatus(403);
    else {
        (async () => {
            try {
                let info ={};
                info.name = data.club;
                info.cid = data.clubID;
                await club.verifyInfo(info);
                next();
            } catch (err) {
                res.status('403').send('社团信息有误！');
            }

        })();
    }
});

router.post('/', function (req, res) {

    let data = req.body;
    let send;
    (async () => {
        try {
            let filename= Date.now()+'.jpg';
            let newfilename = 'new' + filename;
            image_save.image_save(data.pic_url,filename,newfilename);
            data.image = newfilename;
            send = await student.addStudent(data);

            if (!!send) res.send('报名成功！');

        } catch (err) {
            console.log(err);
            res.status(403).send('信息填写有误，请再次确认！');
        }
    })();
});
module.exports = router;