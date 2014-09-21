/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

var Interviewee = require("../module/Interviewee");
/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
router.get('/sign', function(req, res){
	var cid = req.session.cid;
	var sid = req.query.sid;
	if(!cid) {
		res.send(403);
	}
	Interviewee.sign(sid, cid, function (err, success) {
		if(err) {
			res.json(500, err);
		} else {
			if(success) {
				res.json({status: 'success'});
			} else {
				res.json({status: 'selectDep'});
			}
		}
	});
});

/**
 * @params sid
 * @params did[]
 * @return Object {status: 'success'}
 */
router.post('/selectDep', function (req, res){
	var sid = req.param('sid');
	var did = req.param('did');
	var cid = req.session.cid;
	if(!cid) {
		res.send(403);
	}
	Interviewee.selectDep(sid, cid, did, function (err, success) {
		if(err) {
			res.json(500,err);
		} else {
			if(success) {
				res.json({status: 'success'});
			} else {
				res.json({status: 'failed'});
			}
		}
	});
});

module.exports = router;