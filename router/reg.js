let express = require('express');
let interviewee = require('../modules/interviewee');
let utils = require('../utils/utils');
let club = require('../modules/club');
let mid = require('../utils/middleware');
let router = express.Router();
let Joi = require('joi');
let JSONError = require('../utils/JSONError');


let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/', mid.checkFormat(function() {
    return {
        joi: Joi.object().keys({
            clubName: Joi.string(),
            cid: Joi.number().required(),
            name: Joi.string().required(),
            sid: Joi.string().regex(/^1[0-9]{7}$/).required(),
            sex: Joi.number().required(),
            college: Joi.string().required(),
            major: Joi.string().required(),
            volunteer: Joi.array().items(Joi.number()).required(),
            notion: Joi.string().required(),
            phone: Joi.string().regex(/^(1[34578])[0-9]{9}$/).required(),
            qq: Joi.string().regex(/[1-9][0-9]{4,}/).required(),
            short_tel: Joi.string().regex(/[0-9]{6}$/),
            pic_url: Joi.string().required(),
            email:Joi.string()
        }),
        errInfo: {
            sid: '学号',
            phone: '电话',
            qq: 'qq',
            short_tel: '短号',
        }
}}), wrap(async function(req, res) {
    let data = req.body;
    let fileName = data.cid + '-' + data.name + '-' + data.sid + '.jpg';
    let departInfo = await club.getClubInfo(data.cid);
    if(!departInfo || !(data.clubName == departInfo.name)) throw new JSONError('社团id错误');

    let studentInfo = await interviewee.getInterviewerInfo(data.sid, data.cid);
    if(!!studentInfo) throw new JSONError('该学生已注册', 403);
    data.image = await utils.image_save(data.pic_url, fileName);
    let result = await interviewee.addStudent(data);
    res.send({
        status: 200,
        message: result
    });

}));
module.exports = router;