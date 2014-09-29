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
router.post('/recommand', function (req, res){
    var interviewee = req.param('interviewee');
    var department = req.param('department');

});

/**
 * @params sid
 * @params score
 * @params comment
 * @return Object {status: 'success'|'failed'}
 */
router.post('/rate', function(req, res){
    var sid = req.param('sid'),
        score = req.param('score'),
        comment = req.param('comment'),
        did = req.session['did'];
    Interviewee.rateInterviewee(sid, score, comment, did, function (err){
        if (err){
            res.json(500, err + {
                status: 'failed'
            });
        } else {
            res.json({
                status: 'success'
            })
        }
    })

});

/**
 * @return Interviewee
 */
router.get('/call', function (req, res){
    var department = req.session['did'];
    Interviewee.getNextInterviewee(department, function (err, interviewee){
        if (err){
            return res.json(500, err);
        } else {
            res.json(interviewee);
            global.io.to(req.session['club']).emit('call', interviewee);
        }
    })
});

module.exports = router;