const express = require('express'),
    student = require('../db/student'),
    qiniu_download = require('../modules/qiniu_download'),
    request = require('request'),
    gm = require('gm').subClass({imageMagick: true});

var router = express.Router();


router.use('/info', function (req, res, next) {
    var data = req.body;
    if (!data) res.sendStatus(403);
    else {
        //传clubID和club传给面试系统后台验证信息正确性
        request.post('http://~~~~~~~/verifyInfo').form({club: data.club, clubID: data.clubID})
            .on('error', function (err) {
                console.log(err);
            })
            .on('response', function (response) {
                if (response.body.cid && response.body.name) next();
                else res.status('403').send('认证失败！');
            });
    }
});


router.post('/info', function (req, res) {

    var data = req.body;
    var send;
    (async () => {
        try {
            //qiniu模块处理,把图片下载到image，返回filename,存在data.image里,存入数据库

            data.image = await qiniu_download.qiniudownload(data.url, function (err, res, filename) {
                if (err) throw err;
                else if (res) return filename;
            });
            //压缩图片,要安装GraphicsMagick或ImageMagick,再调用gm压缩

            var newfilename = Data.now() + data.image;
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