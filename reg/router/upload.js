
const express =require('express'),
      config = require('../config'),
      fs = require('fs'),
      multer = require('multer'),
      gm = require('gm').subClass({imageMagick:true});

var router = express.Router();

router.post('/', config.upload, function (req, res, next) {

        if (!config.fileFileter(req.file))
            res.send('上传文件格式错误,请上传jpg格式.');
        else
            next();
    },
    function(req,res,next){

    //压缩图片,要安装GraphicsMagick或ImageMagick,再调用gm压缩
        gm('../files/image/'+req.file.filename).resize(240, 240, '!')
            .write('../files/image/'+'1'+ req.file.filename, function (err) {
                if (err) console.log(err);
            });
        next();
    },
    function (req, res) {

        res.send('1'+ req.file.filename);

    });

module.exports = router;