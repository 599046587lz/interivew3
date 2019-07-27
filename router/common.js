let express = require('express');
let upload = require('multer')({dest: '../files/upload'});
let qiniu = require('../utils/qiniu');
let path = require('path');
let router = express.Router();
let mid = require('../utils/middleware');
let Interview = require('../modules/interviewee');
let Club = require('../modules/club');
let office = require('../utils/office');
let Joi = require('joi');
let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/uploadFile', upload.single('file'), wrap(async function (req, res) {

    let file = req.file;
    let fileName = file.originalname;

    let result = await qiniu.qiniuUpload(file.path, fileName)

    res.send(200, result);
}));

router.get('/download', mid.checkFormat(function () {
    return Joi.object().keys({
        cid: Joi.number()
    })
}), wrap(async function (req, res) {
    let cid = req.query.cid;
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
