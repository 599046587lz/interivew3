/**
 * Created by bangbang93 on 14-9-15.
 */
let Router = require('koa-router')
let Interviewee = require('../modules/interviewee');
let Joi = require('joi');
let mid = require('../utils/middleware');
let JSONError = require('../utils/JSONError');

let router = new Router({
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
    let sid = ctx.request.body.sid;
    let departmentId = ctx.request.body.departmentId;
    let cid = ctx.session.cid;
    let score = ctx.request.body.score;
    let comment = ctx.request.body.comment;
    let interviewer = ctx.session.interviewer;
    await Interviewee.rateInterviewee(cid, sid, score, comment, departmentId, interviewer);
    let interviewerInfo = await Interviewee.getInterviewerInfo(sid, cid);
    if (interviewerInfo.volunteer.indexOf(departmentId) >= 0) throw new JSONError('不能重复推荐部门', 403);
    interviewerInfo.volunteer.push(departmentId);
    interviewerInfo.busy = false;
    interviewerInfo.save();
    await Interviewee.delVolunteer(cid,sid, departmentId)
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
    let sid = ctx.request.body.sid;
    let score = ctx.request.body.score;
    let comment = ctx.request.body.comment;
    let did = ctx.session.did;
    let interviewer = ctx.session.interviewer;
    let cid = ctx.session.cid;

    await Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer);

    ctx.response.status = 204;
});

/**
 * 未测试
 */

//确认面试是否开始
router.get('/start',  mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), async function (ctx) {
    let cid = ctx.session.cid;
    let sid = ctx.request.body.sid;
    let info = await Interviewee.getStartInfo(sid,cid);
    ctx.response.status = 200;
    ctx.response.data = info;
});
/**
 * 测试通过(需要socket)(需测试)
 */


router.get('/call', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), async function (ctx) {
    let department = ctx.session.did;
    let sid = ctx.request.query.sid;
    let cid = ctx.session.cid;
    if (!sid) {
        let result = await Interviewee.getNextInterviewee(cid, department);
        if(result !== null){
            result = result.toObject();
            result.did = department;
        }
        ctx.response.body = result;
    } else {
        let result = await Interviewee.getSpecifyInterviewee(sid, cid, department);
        result = result.toObject();
        result.did = department;
        ctx.response.body = result;
    }
});


/**
 * 测试成功
 */


//返回ok
router.get('/queue', async function (ctx) {
    let cid = ctx.session.cid;
    let did = ctx.session.did;

    let result = await Interviewee.getDepartmentQueueLength(cid, did);

    ctx.response.status = 200;
    ctx.response.count = result;
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
    let cid = ctx.session.cid;
    let sid = ctx.request.body.sid;
    let did = ctx.session.did;

    let result = await Interviewee.skip(cid, sid, did);

    ctx.response.status = 200;
    ctx.response.body = result;

});


module.exports = router;