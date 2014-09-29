

var Interviewee = require('../models/interviewee');

exports.sign = function (sid, cid, callback) {
	Interviewee.getStuBySid(sid, cid, function (err, docs){
		if(err) {
			callback(err);
		} else {
			if(0 == docs.length) {
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
		signTime: date
	};
	Interviewee.addInterviewee(data,cid,function (err) {
		if(err) {
			callback(err);
		} else {
			callback(null,true);
		}
	});
};

exports.getNextInterviewee = function (did, cb){
    Interviewee.getNextInterviewee(did, function (err, interviewee){
        if (err){
            cb (err);
        } else {
            if (!!interviewee){
                cb (null, interviewee);
            } else {
                cb (null, {});
            }
        }
    })
};

exports.rateInterviewee = function (sid, score, commit, did, cb){
    Interviewee.rateInterviewee(sid, score, commit, did, function (err){
        cb(err);
    })
};

exports.recommend = function (sid, rdid, cb){
    Interviewee.recommend(sid, rdid, function (err){
        cb(err);
    })
};