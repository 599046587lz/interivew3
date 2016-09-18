/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

var Interviewee = require("../modules/interviewee");
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
	Interviewee.sign(sid, cid, function (err, interviewee) {
		if(err) {
			res.send(err);
		} else {
			res.json(interviewee);
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
	var cid = req.session['cid'];
	if(!cid) {
		res.send(403);
	}
	Interviewee.selectDep(sid, cid, did, function (err, interviewee) {
		if(err) {
			if (!!err.sid){
				res.json(404, err);
			} else {
				res.json(500,err);
			}
		} else {
			if(interviewee) {
				res.json(200, interviewee);
			} else {
				res.send(500);
			}
		}
	});
});

router.post('/addDep',function(req,res){

	var cid = req.session['cid'];
	if(!cid){
		res.send(403);
	}
	else{
		var info = {
			sid: req.param('sid'),
			volunteer: req.param('did'),
			sex: req.param('sex'),
			name: req.param('name'),
			qq: req.param('qq'),
			phone: req.param('phone'),
			signTime: new Date()
		};
		Interviewee.addDep(cid, info, function(err,interviewee){
			if(err) {
				if (!!err.sid){
					res.json(404, err);
				} else {
					res.json(500,err);
				}
			} else {
				if(interviewee) {
					res.json(200, interviewee);
				} else {
					res.send(500);
				}
			}
		});
	}
});

module.exports = router;