const Router = require('koa-router');
const Joi = require('joi');
const interviewee = require('../modules/interviewee');
const club = require('../modules/club');
const utils = require('../utils/utils');
const mid = require('../utils/middleware');
const JSONError = require('../utils/JSONError');

const router = new Router({
    prefix: '/reg'
});

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
            phone: Joi.string().regex(/^(1)[0-9]{10}$/).required(),
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
}}), async function(ctx) {
    const data = ctx.request.body;
    const fileName = data.cid + '-' + data.name + '-' + data.sid + '.jpg';
    const departInfo = await club.getClubInfo(data.cid);
    if(!departInfo || !(data.clubName === departInfo.name)){
        throw new JSONError('社团id错误');
    }

    const studentInfo = await interviewee.getInterviewerInfo(data.sid, data.cid);
    if(!!studentInfo) {
        throw new JSONError('该学生已注册', 403);
    }

    data.regTime = new Date();
    data.image = await utils.image_save(data.pic_url, fileName);
    // let result = await interviewee.addStudent(data);
    await interviewee.addStudent(data);
    ctx.response.status = 200;
    //ctx.response.body = result;
});

module.exports = router;