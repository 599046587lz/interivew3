const express = require('express'),
    student = require('../modules/student'),
    qiniu_download = require('../utils/qiniu_download'),
    club = require('../modules/club'),
    //request = require('request'),
    gm = require('gm').subClass({imageMagick: true});

let router = express.Router();


router.use('/info', function (req, res, next) {
    let data = req.body;
    if (!data) res.sendStatus(403);
    else {
        try{
            club.verifyInfo(data);
            next();
        }catch(err){
            res.status('403').send('社团信息有误！');
        }

    }
});

router.post('/info', function (req, res) {

    let data = req.body;
    let send;
    (async () => {
        try {
            //qiniu模块处理,把图片下载到image，返回filename,存在data.image里,存入数据库

            data.image = await qiniu_download.qiniudownload(data.url, function (err, res, filename) {
                if (err) throw err;
                else if (res) return filename;
            });
            //压缩图片,要安装GraphicsMagick或ImageMagick,再调用gm压缩

            let newfilename = Data.now() + data.image;
            await gm('../files/image/' + data.image).resize(240, 240, '!')
                .write('../files/image/' + newfilename, function (err) {
                    if (err) throw err;
                });

            data.image = newfilename;

            // 将信息存入数据库
            send = await student.addStudent(data);

            if (!!send) res.send('报名成功！');

        } catch (err) {
            res.status(403).send('信息填写有误，请再次确认！');
        }
    })();
});
module.exports = router;