let express = require('express');
let config = require('../config');
let path = require('path');
let router = express.Router();
let mid = require('../utils/middleware');
let Student = require('../modules/student');
let office = require('../utils/office');
let Joi = require('Joi');
let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.get('/uploadToken', function (req, res) {
    let qiniu = require('qiniu');
    let mac = new qiniu.auth.digest.Mac(config.QINIU_ACCESSKEY, config.QINIU_SECRETKEY);
    let bucket = config.QINIU_BUCKET;
    let options = {
        scope: bucket,
        returnBody: '{"url": "http://ot0i9omzm.bkt.clouddn.com/$(key)"}',
        saveKey: req.query.type + '/' + "$(sha1)",
        persistentOps: 'imageView2/0/format/jpg/q/75|imageslim'
    };
    let putpolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putpolicy.uploadToken(mac);

    res.json({
        'token': uploadToken
    })
});

router.get('/download', mid.checkFormat(function () {
    return Joi.object().keys({
        clubID: Joi.number()
    })
}), wrap(async function (req, res) {

    let clubID = req.param('clubID');
    let file, filename, dbData;
    dbData = await Student.queryByClubAll(clubID);
    for (let i of dbData) {
        await office.writeWord(i);
    }
    await office.writeExcel(dbData, clubID);
    let result = await office.archiverZip(clubID);

    file = path.resolve(__dirname, '../files/zip/' + clubID + '/' + clubID + '.zip');
    filename = clubID + '.zip';
    res.download(file, filename);
}));

module.exports = router;
