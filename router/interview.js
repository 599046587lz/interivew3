/**
 * Created by bangbang93 on 14-9-15.
 */
const Router = require('koa-router');
const Joi = require('joi');
const Interviewee = require('../modules/interviewee');
const club = require('../modules/club');
const mid = require('../utils/middleware');
const JSONError = require('../utils/JSONError');

const router = new Router({
    prefix: '/interview'
});

/**
 * 测试成功
 */

router.post('/recommend',mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number(),
        departmentId: Joi.number(),
        score: Joi.number().valid([1, 2, 3, 4, 5]),
        comment: Joi.string()
    })
}), async function (ctx) {
    const {sid,departmentId,score,comment} = ctx.request.body;
    const {interviewer,cid} = ctx.session;

    await Interviewee.rateInterviewee(cid, sid, score, comment, departmentId, interviewer);
    let interviewerInfo = await Interviewee.getInterviewerInfo(sid, cid);
    if (interviewerInfo.volunteer.indexOf(departmentId) >= 0) {
        throw new JSONError('不能重复推荐部门', 403);
    }
    interviewerInfo.volunteer.push(departmentId);
    interviewerInfo.busy = false;
    interviewerInfo.save();
    await Interviewee.delVolunteer(cid,sid, departmentId);
    ctx.response.status = 204;
});

/**
 * 测试成功
 */

router.post('/rate', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number(),
        score: Joi.number().valid([1, 2, 3, 4, 5]),
        comment: Joi.string()
    })
}),async function (ctx) {
    const {sid,score,comment} = ctx.request.body;
    const {did,interviewer,cid} = ctx.session;

    await Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer);
    ctx.session.sid = undefined;

    ctx.response.status = 204;
});

/**
 * 未测试
 */

/**
 * 测试通过(需要socket)(需测试)
 */
//插队的时候传sid
router.get('/call',  mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), async function (ctx) {
    const {did,cid} = ctx.session;
    const sid = ctx.request.query.sid;
    if (!sid) {
        let result = await Interviewee.getNextInterviewee(cid, did);
        if(result !== null){
            result = result.toObject();
            result.did = did;
        }
        ctx.response.body = result;
    } else {
        let result = await Interviewee.tocallNextInterviewee(sid, cid, did);
        result = result.toObject();
        result.did = did;
        ctx.response.body = result;
    }
});


//确认面试是否开始
router.get('/start',mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), async function (ctx) {
    const {did, cid} = ctx.session;
    const sid = ctx.request.query.sid;

    let result = await Interviewee.getSpecifyInterviewee(cid, did, sid);

    if(result === null){
        ctx.response.body = '等待确认中';
        ctx.response.status = 202;
        return;
    }
    if(result.ifconfirm === 1){
        result.did = did;
        ctx.response.body = result;
        ctx.response.status = 200;
        return;
    }
    if(result.ifconfirm === 0){
        throw new JSONError('该人已被跳过',403)
    }

});

/**
 * 测试成功
 */

router.get('/queue', async function (ctx) {
    const {cid,did} = ctx.session;

    const info = await club.getClubInfo(cid);
    if (did < 0 || did > info.departments.length) {
        throw new JSONError('不存在该部门', 403);
    }

    const result = await Interviewee.getDepartmentQueueLength(cid, did);

    ctx.response.status = 200;
    ctx.response.body = result;
});

/**
 * 测试成功
 */

//跳过  测试成功
router.post('/skip',mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}),  async function (ctx) {
    const {cid,did} = ctx.session;
    const sid = ctx.request.body.sid;

    const result = await Interviewee.skip(cid, sid, did);

    ctx.response.status = 200;
    ctx.response.body = result;

});

module.exports = router;
