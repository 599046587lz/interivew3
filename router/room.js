/**
 * Created by bangbang93 on 14-9-15.
 */
let Router = require('koa-router');
let Interviewee = require("../modules/interviewee");
let Joi = require('joi');
let mid = require('../utils/middleware');
let JSONError = require('../utils/JSONError');
let club = require('../modules/club');

let router = new Router({
    prefix: '/room'
});

/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
/**
 * 测试通过
 */


router.get('/sign', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), async function (ctx) {
    let cid = ctx.session.cid;
    let sid = ctx.request.query.sid;
    let info = await Interviewee.getInterviewerInfo(sid, cid);
    if (!info) {
        throw new JSONError('该学生未报名', 403);
    }
    if (info.signTime) {
        info = null;
    } else {
        info.signTime = new Date();
        info.save();
    }
    ctx.response.status = 200;
    ctx.response.data = info;
});


//返回ok
router.get('/finish', async function (ctx) {
    let cid = ctx.session.cid;
    let info = await Interviewee.getFinishInfo(cid);
    ctx.response.status = 200;
    ctx.response.body = info;
});


//返回ok
router.get('/signed', async function (ctx) {
    let cid = ctx.session.cid;
    let info = await Interviewee.getSignedInterviewee(cid);
    ctx.response.status = 200;
    ctx.response.body = info;
});


//返回ok
router.get('/calling', async function (ctx) {
    let cid = ctx.session.cid;
    let info = await Interviewee.callNextInterviewee(cid);
    ctx.response.status = 200;
    ctx.response.body = info;
});

/**
 * 测试成功
 */

//成功
router.post('/addDep', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number(),
        did: Joi.number(),
        sex: Joi.number(),
        name: Joi.string(),
        qq: Joi.number(),
        phone: Joi.number()
    })
}),async function (ctx) {
    let info = {
        sid: ctx.request.body.sid,
        volunteer: ctx.request.body.did,
        sex: ctx.request.body.sex,
        name: ctx.request.body.name,
        qq: ctx.request.body.qq,
        phone: ctx.request.body.phone,
        signTime: new Date()
    };

    let result = await Interviewee.addInterviewee(info, cid);
    ctx.response.status = 200;
    ctx.response.body = result;
});



//成功
router.get('/getDepartmentInfo', async function (ctx) {
    let cid = ctx.session.cid;
    let result = await club.getDepartmentInfo(cid);
    ctx.response.status = 200;
    ctx.response.body = result;
});

/**
 * 未测试
 */

//叫到号的同学进行确认
router.post('/confirm', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number().required(),
        confirm: Joi.boolean().required()
    })
}), async function (ctx) {
    let cid = ctx.session.cid;
    let sid = ctx.request.body.sid;
    let confirm = ctx.request.body.confirm;
    let info = await Interviewee.getConfirmInfo(sid,cid,confirm);
    ctx.response.status = 200;
    ctx.response.data = info;
});


module.exports = router;