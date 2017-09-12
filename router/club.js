/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Club = require('../modules/club');
let Interviewee = require('../modules/interviewee');
let mid = require('../utils/middleware');
let Joi = require('joi');
let multer = require('multer');
let upload = multer({dest: '../files/upload'});
let utils = require('../utils/utils');
let JSONError = require('../utils/JSONError');
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

/**
 * @params Number did 部门ID
 * @params String interviewerName 面试官姓名
 * @return HTTP 204
 */
router.post('/setIdentify', function (req, res) {
    let name = req.session.club;
    if (!name) {
        return res.send(403);
    }
    req.session['did'] = req.body.did;
    req.session['interviewer'] = req.body.interviewerName;
    res.send(204);

});


router.get('/logout', mid.checkLogin, function (req, res) {
    req.session.destroy(function () {
        res.send(204);
    });
});

/**
 * 上传应试者资料
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */

router.post('/upload/archive', upload.single('archive'), mid.checkFormat(function() {
    return Joi.object().keys({
        cid: Joi.number(),
        roomLocation: Joi.string(),
        did: Joi.number()
    })
}), wrap(async function (req, res) {
    let file = req.file;
    let cid = req.body.cid;
    let roomLocation = req.body.roomLocation;
    let did = req.body.did;
    // if (!file || !req.session['cid']) throw new Error('参数不完整');
    let xlsxReg = /\.xlsx$/i;
    if (!xlsxReg.test(file.originalname)) throw new Error('上传文件不合法');

    await Club.setRoomLocation(cid, did, roomLocation);
    let result = await Club.handleArchive(file, cid);
    res.json({
        status: 'success',
        count: result
    });
}));

/**
 * ??未测试
 */

router.get('/extra', wrap(async function (req, res) {
    let cid = req.session['cid'];
    if (!cid) throw new Error('参数不完整');

    let result = await Interviewee.getIntervieweeBySid({$ne: null}, cid);
    let fields = [];
    for (let i in result.extra) {
        if (result.extra.hasOwnProperty(i)) {
            fields.push(i)
        }
    }

    res.json(fields);
}));


/**
 * 测试通过
 */

router.get('/export', mid.checkFormat(function () {
    return Joi.object().keys({
        did: Joi.number()
    })
}), wrap(async function (req, res) {
    let cid = req.session['cid'];
    let did = req.body.did;

    if (!cid || !did) {
        throw new Error('参数不完整');
    }

    let result = await Club.exportInterviewees(cid, did);
    res.json(result);
}));

router.get('/clubInfo', mid.checkFormat(function () {
    return Joi.object().keys({
        clubId: Joi.number()
    })
}), wrap(async function (req, res) {
    let cid = req.body.clubId;
    let result = await Club.getClubInfo(cid);
    let info = {
        clubName: result.name,
        departments: result.departments,
        maxDep: result.maxDep
    };

    return res.json({
        status: 200,
        message: info
    });
}));

router.post('/verifyInfo', mid.checkFormat(function() {
    return Joi.object().keys({
        clubId: Joi.number(),
        name: Joi.string()
    })
}), wrap(async function (req, res) {
    let info = {};
    info.cid = req.body.clubId;
    info.name = req.body.name;

    let result = await Club.verifyInfo(info);
    return res.json(result);
}));
/**
 * 临时接口
 */

router.post('/insertInfo', wrap(async function (req, res) {
    let data = {};
    data.cid = req.body.cid;
    data.name = req.body.name;
    data.logo = req.body.logo;
    data.departments = req.body.departments;
    data.interviewer = req.body.interviewer;
    data.password = req.body.password;
    data.maxDep = req.body.maxDep;

    let result = await Club.insertInfo(data);

    res.json(200, result);
}));

router.get('/regNum', mid.checkFormat(function() {
    return Joi.object().keys({
        clubId: Joi.number()
    })
}), wrap(async function (req, res) {
    let clubId = req.body.clubId;
    let result = await Club.getRegNum(clubId);
    res.send(200, result);
}));

router.post('/sendMessage', wrap(async function(req, res) {
    let data = req.body;

    let result = await utils.sendMessage(data);
    res.send(200, '发送成功');
}));

router.post('/sendEmail', wrap(async function(req, res) {
    let data = req.body;
    let result = await utils.sendMail(data);
    res.send(200, '发送成功');
}));

module.exports = router;
