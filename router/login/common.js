let express = require('express');
let config = require('../../config/config');
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


module.exports = router;
