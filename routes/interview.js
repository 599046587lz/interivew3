/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();
var Interviewee = require('../modules/interviewee');

/**
 * @params sid
 * @params department
 * @return Object {status: 'success'|'failed'}
 */
router.post('/recommend', function (req, res){
    var sid = req.param('sid'),
        department = req.param('department'),
        cid = req.session['cid'];
    Interviewee.recommend(cid, sid, department, function (err){
        if (err){
            res.send(500);
        } else {
            res.send(204);
        }
    })
});

/**
 * @params sid
 * @params score
 * @params comment
 * @return HTTP 204
 */
router.post('/rate', function(req, res){
    var sid = req.param('sid'),
        score = req.param('score'),
        comment = req.param('comment'),
        did = req.session['did'],
        interviewer = req.session['interviewer'],
        cid = req.session['cid'];
    Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer, function (err){
        if (err){
            res.send(500);
        } else {
            res.send(204);
        }
    })

});

/**
 * @params optional sid
 * @return Interviewee
 */
router.get('/call', function (req, res){
    var department = req.session['did'];
    var sid = req.param('sid');
    var cid = req.session['cid'];
    var did = req.session['did'];
    if (!cid){
        res.send(403);
    }
    if (!sid){
        Interviewee.getNextInterviewee(cid, department, function (err, interviewee) {
            if (err) {
                if (!!err['sid']){
                    return res.json(err.code || 500, err);
                } else {
                    return res.json(500, err);
                }
            } else {
                if (!!interviewee){
                    interviewee = interviewee.toObject();
                    interviewee.did = department;
                   var timer = setTimeout(function (){
                        Interviewee.recoverInterviewee(interviewee.sid, cid, did, function (err) {
                            if(err)
                                res.send(501);
                            else
                                res.send(500);
                        })
                   }, 1000);
                    global.io.to(cid).emit('call', interviewee);
                    global.io.to(cid).on('success', function () {
                        clearTimeout(timer);
                        res.json(interviewee);
                    });

                } else {
                    res.send(404);
                }
            }
        })
    } else {
        Interviewee.getSpecifyInterviewee(sid, cid, did, function (err, interviewee){
            if (err){
                if (!!err['sid']){
                    return res.json(err.code || 500, err);
                } else {
                    return res.json(500, err);
                }
            } else {
                if (!!interviewee){
                    interviewee = interviewee.toObject();
                    interviewee.did = department;
                    var timer = setTimeout(function (){
                        Interviewee.recoverInterviewee(interviewee.sid, cid, did, function (err) {
                            if(err)
                                res.send(501);
                            else
                                res.send(500);
                        })
                    }, 1000);
                    global.io.to(cid).emit('call', interviewee);
                    global.io.to(cid).on('success', function () {
                        clearTimeout(timer);
                        res.json(interviewee);
                    });


                } else {
                    res.send(404);
                }
            }
        })
    }
});

/**
 *
 */
router.get('/queue', function (req, res){
    var cid = req.session['cid'],
        did = req.session['did'];
    Interviewee.getDepartmentQueueLength(cid, did, function (err, count){
        if (err){
            res.json(500, err);
        } else {
            res.json({
                count: count
            })
        }
    })
});


/**
 * @param sid
 */
router.post('/skip', function (req, res){
    var cid = req.session['cid'],
        sid = req.param('sid');
    if (!cid || !sid){
        return res.send(403);
    }
    Interviewee.skip(cid, sid, function(err){
        if(err){
            res.send(500);
        }else{
            res.send(204);
        }
    });
});

module.exports = router;