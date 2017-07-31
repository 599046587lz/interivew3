/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Interviewee = require('../modules/interviewee');


/**
 * 测试成功
 */

router.post('/recommend', wrap(async function(req, res) {
    let sid = req.param('sid'),
        departmentId = req.param('departmentId'),
        cid = req.session['cid'];

    let result = await Interviewee.recommend(cid, sid, departmentId);
    res.send(204);
}));

/**
 * 测试成功
 */

router.post('/rate', wrap(async function(req, res) {
    let sid = req.param('sid'),
        score = req.param('score'),
        comment = req.param('comment'),
        did = req.session['did'],
        interviewer = req.session['interviewer'],
        cid = req.session['cid'];
    let result = await Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer);

    res.send(204);
}));

/**
 * 测试通过(需要socket)
 */

router.get('/call', wrap(async function(req, res) {
    let department = req.session['did'];
    let sid = req.param('sid');
    let cid = req.session['did'];
    if(!cid) {
        throw new Error('缺少社团id');
    }
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
    let cid = req.session['cid'],
        did = req.session['did'];


    let result = await Interviewee.getDepartmentQueueLength(cid, did);

    res.json({
        count: result
    })
}));

/**
 * 测试成功
 */

router.post('/skip', wrap(async function(req, res) {
    let cid = req.session['cid'],
        sid = req.param('sid'),
        did = req.session['did'];

    if(!cid || !sid) {
        throw new Error('参数不完整');
    }
    let result = await Interviewee.skip(cid, sid, did);

    res.send(204);
}));

module.exports = router;