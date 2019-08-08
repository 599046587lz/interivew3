/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Interviewee = require('../modules/interviewee');
let Joi = require('joi');
let mid = require('../utils/middleware');
let JSONError = require('../utils/JSONError');

/**
 * 测试成功
 */

router.post('/recommend', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number(),
        departmentId: Joi.number(),
        score: Joi.number().valid([1, 2, 3, 4, 5]),
        comment: Joi.string()
    })
}), wrap(async function (req, res) {
    let sid = req.body.sid;
    let departmentId = req.body.departmentId;
    let cid = req.session.cid;
    let score = req.body.score;
    let comment = req.body.comment;
    let interviewer = req.session.interviewer;
    await Interviewee.rateInterviewee(cid, sid, score, comment, departmentId, interviewer);
    let interviewerInfo = await Interviewee.getInterviewerInfo(sid, cid);
    if (interviewerInfo.volunteer.indexOf(departmentId) >= 0) throw new JSONError('不能重复推荐部门', 403);
    interviewerInfo.volunteer.push(departmentId);
    interviewerInfo.busy = false;
    interviewerInfo.save();
    await Interviewee.delVolunteer(cid,sid, departmentId)
    return res.send(204);
}));

/**
 * 测试成功
 */

router.post('/rate', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number(),
        score: Joi.number().valid([1, 2, 3, 4, 5]),
        comment: Joi.string()
    })
}), wrap(async function (req, res) {
    let sid = req.body.sid;
    let score = req.body.score;
    let comment = req.body.comment;
    let did = req.session.did;
    let interviewer = req.session.interviewer;
    let cid = req.session.cid;

    await Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer);

    res.sendStatus(204);
}));

/**
 * 测试通过(需要socket)(需测试)
 */

router.get('/call', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), wrap(async function (req, res) {
    let department = req.session.did;
    let sid = req.query.sid;
    let cid = req.session.cid;
    if (!sid) {
        let result = await Interviewee.getNextInterviewee(cid, department);
        if(result !== null){
            result = result.toObject();
            result.did = department;
        }
        res.json(result);
    } else {
        let result = await Interviewee.getSpecifyInterviewee(sid, cid, department);
        result = result.toObject();
        result.did = department;
        res.json(result);
    }
}));

/**
 * 测试成功
 */

router.get('/queue', wrap(async function (req, res) {
    let cid = req.session.cid;
    let did = req.session.did;

    let result = await Interviewee.getDepartmentQueueLength(cid, did);

    res.json({
        status: 200,
        count: result
    })
}));

/**
 * 测试成功
 */

router.post('/skip', mid.checkFormat(function () {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), wrap(async function (req, res) {
    let cid = req.session.cid;
    let sid = req.body.sid;
    let did = req.session.did;

    let result = await Interviewee.skip(cid, sid, did);

    res.json({
        status: 200,
        message: result
    });
}));

module.exports = router;