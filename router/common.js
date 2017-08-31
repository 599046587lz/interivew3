let express = require('express');
let config = require('../config');
let path = require('path');
let router = express.Router();
let mid = require('../utils/middleware');
let Interview = require('../modules/interviewee');
let Club = require('../modules/club');
let office = require('../utils/office');
let Joi = require('joi');
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let Base64 = require('js-base64').Base64;

router.get('/uploadToken', function (req, res) {
    let qiniu = require('qiniu');
    let mac = new qiniu.auth.digest.Mac(config.QINIU_ACCESSKEY, config.QINIU_SECRETKEY);
    let bucket = config.QINIU_BUCKET;
    let data = new Date().getTime();
    let options = {
        scope: bucket,
        returnBody: '{"url": "http://ot0i9omzm.bkt.clouddn.com/$(key)"}',
        saveKey: req.query.type + '/' + "$(sha1)" + data,
        persistentOps: 'imageView2/0/format/jpg/q/75|saveas/' + Base64.encode( bucket + ':' + req.query.type + '/' + "$(sha1)")
    };
    let putpolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putpolicy.uploadToken(mac);

    res.json({
        'token': uploadToken
    })
});

router.get('/download', mid.checkFormat(function () {
    return Joi.object().keys({
        cid: Joi.number()
    })
}), wrap(async function (req, res) {
    let cid = req.param('cid');
    let dbData = await Interview.queryByClubAll(cid);
    let departments = (await Club.getClubInfo(cid)).departments;
    let departName = {};
    departments.forEach(e => {
       departName[e.did] = e.name;
    });
    for (let i in dbData) {
       dbData[i].volunteer.forEach((e, j) => {
          dbData[i].volunteer[j] = departName[e];
       });
        await office.writeWord(dbData[i], i);
    }
    await office.writeExcel(dbData, cid);
    let result = await office.archiverZip(cid);

    let file = path.resolve(__dirname, '../files/zip/' + cid + '/' + cid + '.zip');
    let filename = cid + '.zip';
    res.download(file, filename);
}));

module.exports = router;
