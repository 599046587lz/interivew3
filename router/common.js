let express = require('express');
let upload = require('multer')({dest: '../files/upload'});
let qiniu = require('../utils/qiniu');
let path = require('path');
let router = express.Router();
let mid = require('../utils/middleware');
let Interview = require('../modules/interviewee');
let Club = require('../modules/club');
let office = require('../utils/office');
let utils = require('../utils/utils');
let JSONError = require('../utils/JSONError');
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

/**
 * @params Number clubId 社团Id
 * @return 204
 */
//报名界面获取社团信息
router.get('/clubInfo', mid.checkFormat(function () {
        return Joi.object().keys({
            clubId: Joi.number()
        })
}), wrap(async function (req, res) {
    let cid = req.query.clubId;
    let result = await Club.getClubInfo(cid);
    let info = {
        clubName: result.name,
        departments: result.departments,
        maxDep: result.maxDep,
        attention: result.attention
    };

    return res.json({
        status: 200,
        message: info
    });
}));

/**
 * @params String user 登录用户名
 * @params String password 密码，单词md5
 * @return 204
 */

router.post('/login', mid.checkFormat(function () {
    return Joi.object().keys({
        user: Joi.string().required(),
        password: Joi.string().required()
    })
}), wrap(async function (req, res) {
    let user = req.body.user;
    let password = utils.md5(req.body.password);
    let clubInfo = await Club.getClubByName(user);
    if (clubInfo && password == clubInfo.password && user == clubInfo.name) {
        clubInfo = clubInfo.toObject();
        delete clubInfo.password;
        req.session.club = clubInfo.name;
        req.session.cid = clubInfo.cid;
        return res.json({
            status: 200,
            message: clubInfo
        });
    } else {
        throw new JSONError('用户名或密码错误', 403);
    }
}));

module.exports = router;
