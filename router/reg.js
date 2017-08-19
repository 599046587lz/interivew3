let express = require('express');
let student = require('../modules/student');
let utils = require('../utils/utils');
let club = require('../modules/club');
let mid = require('../utils/middleware');
let router = express.Router();
let Joi = require('joi');


let wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/', mid.checkFormat(function() {
    return Joi.object().keys({
        club: Joi.string().required(),
        clubID: Joi.number().required(),
        name: Joi.string().required(),
        studentID: Joi.number().required(),
        gender: Joi.number().required(),
        college: Joi.string().required(),
        major: Joi.string().required(),
        department: Joi.array().items(Joi.object().keys({
            column: Joi.array().items(Joi.string()),
            departname: Joi.string()
        })).required(),
        intro: Joi.string().required(),
        tel: Joi.number().required(),
        qq: Joi.number().required(),
        email: Joi.string().required(),
        pic_url: Joi.string().required(),
    })
}), wrap(async function(req, res) {
    let data = req.body;
    let info = {};
    let fileName = data.name + data.studentID + '.jpg';

    info.club = data.club;
    info.clubID = data.clubID;
    await club.verifyInfo(info);
    await student.checkStudent(data.studentID, data.clubID);
    data.image = await utils.image_save(data.pic_url, fileName);
    let result = await student.addStudent(data);
    res.send(200, result);

}));
module.exports = router;