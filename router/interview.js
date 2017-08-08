/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Interviewee = require('../modules/interviewee');
let Joi = require('Joi');
let mid = require('../utils/middleware');

/**
 * 测试成功
 */

router.post('/recommend', mid.checkFormat(function() {
    return Joi.object().keys({
        sid: Joi.number(),
        departmentId: Joi.number()
    })
}), wrap(async function(req, res) {
    let sid = req.body.sid;
    let departmentId = req.body.departmentId;
    let cid = req.session.cid;

    let result = await Interviewee.recommend(cid, sid, departmentId);
    res.send(204);
}));

/**
 * 测试成功
 */

router.post('/rate', mid.checkFormat(function() {
    return Joi.object().keys({
        sid: Joi.number(),
        score: Joi.number(),
        comment: Joi.string()
    })
}), wrap(async function(req, res) {
    let sid = req.body.sid;
    let score = req.body.score;
    let comment = req.body.comment;
    let did = req.session.did;
    let interviewer = req.session.interviewer;
    let cid = req.session.cid;

    let result = await Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer);

    res.send(204);
}));

/**
 * 测试通过(需要socket)(需测试)
 */

router.get('/call', mid.checkFormat(function() {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), wrap(async function(req, res) {
    let department = req.session.did;
    let sid = req.param('sid');
    let cid = req.session.did;

    if(!sid) {
       let result = await Interviewee.getNextInterviewee(cid, department);
       result = result.toObject();
       result.did = department;
       let timer = setTimeout(function () {
           Interviewee.recoverInterviewee(sid, cid, department);
       }, 2000);

       let room = global.io.to(cid);
       room.emit('call', result);
       for(let socketId in room.connected){
           let socket = room.connected[socketId];
           socket.on('success', function () {
               clearTimeout(timer);
               res.json(result);
           });
       }
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

router.get('/queue', wrap(async function(req, res) {
    let cid = req.session.cid;
    let did = req.session.did;

    let result = await Interviewee.getDepartmentQueueLength(cid, did);

    res.json({
        count: result
    })
}));

/**
 * 测试成功
 */

router.post('/skip', mid.checkFormat(function() {
    return Joi.object().keys({
        sid: Joi.number()
    })
}), wrap(async function(req, res) {
    let cid = req.session.cid;
    let sid = req.body.sid;
    let did = req.session.did;

    if(!cid || !sid) {
        throw new Error('参数不完整');
    }
    let result = await Interviewee.skip(cid, sid, did);

    res.send(200, result);
}));

module.exports = router;