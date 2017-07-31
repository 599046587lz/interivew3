let express = require('express');
let config = require('../config');
let path = require('path');
let package = require('../utils/package');
let router = express.Router();

router.get('/uploadToken', function (req, res) {
    let qiniu = require('qiniu');
    let mac = new qiniu.auth.digest.Mac(config.QINIU_ACCESSKEY, config.QINIU_SECRETKEY);
    let bucket = config.QINIU_BUCKET;
    let options = {
        scope: bucket,
        returnBody: '{"url": "http://ot0i9omzm.bkt.clouddn.com/$(key)"}',
        saveKey: req.query.type + '/' + "$(sha1)"
    };
    let putpolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putpolicy.uploadToken(mac);

    res.json({
        'token': uploadToken
    })
});

router.get('/download/:clubID', function (req, res) {

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
});

module.exports = router;
