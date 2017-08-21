let express = require('express');
let student = require('../modules/student');
let utils = require('../utils/utils');
let club = require('../modules/club');
let mid = require('../utils/middleware');
let router = express.Router();
let Joi = require('joi');


let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/', mid.checkFormat(function() {
    return {joi: Joi.object().keys({
        club: Joi.string().required(),
        clubID: Joi.number().required(),
        name: Joi.string().required(),
        studentID: Joi.string().regex(/^1[0-9]{7}$/).required(),
        gender: Joi.number().required(),
        college: Joi.string().required(),
        major: Joi.string().required(),
        department: Joi.array().items(Joi.string()).required(),
        intro: Joi.string().required(),
        tel: Joi.string().regex(/^(1[34578])[0-9]{9}$/).required(),
        qq: Joi.string().regex(/[1-9][0-9]{4,}/).required(),
        short_tel: Joi.string(),
        pic_url: Joi.string().required(),
        email:Joi.string()
    }), errInfo: {
            studentID: '学号',
            tel: '电话',
            qq: 'qq',
            short_tel: '短号',
        }
}}), wrap(async function(req, res) {
    let data = req.body;
    let info = {};
    let fileName = data.clubID + '-' + data.name + '-' + data.studentID + '.jpg';

    info.club = data.club;
    info.clubID = data.clubID;
    await club.verifyInfo(info);
    await student.checkStudent(data.studentID, data.clubID);
    data.image = await utils.image_save(data.pic_url, fileName);
    let result = await student.addStudent(data);
    res.send(200, result);

}));
module.exports = router;