

var Interviewee = require('../models/interviewee');

exports.sign = function (sid, cid, callback) {
	Interviewee.getStuBySid(sid, cid, function (err, docs){
		if(err) {
			callback(err);
		} else {
			if(!docs) {
				callback(null,false);
			} else {
				Interviewee.sign(sid, cid, function (err) {
					if(err) {
						callback(err);
					} else {
						callback(null,true);
					}
				});
			}
		}
	});
};

exports.selectDep = function (sid, cid, did, callback) {
	var date = new Date();
	var data = {
		sid: sid,
		volunteer: did,
		signTime: date,
	};
	Interviewee.addInterviewee(data,cid,function (err) {
		if(err) {
			callback(err);
		} else {
			callback(null,true);
		}
	})
};