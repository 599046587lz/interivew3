

var Interviewee = require('../models/interviewee');

exports.sign = function (sid, cid, callback) {
	Interviewee.getStuBySid(sid, cid, function (err, doc){
		if(err) {
			callback(err);
		} else {
			if(!doc) {
				callback(null,false);
			} else {
				Interviewee.sign(sid, cid, function (err, interviewee) {
					if(err) {
						callback(err);
					} else {
						callback(null, interviewee);
					}
				});
			}
		}
	});
};

exports.selectDep = function (sid, cid, did, callback) {
    Interviewee.getStuByAPI(sid, function (err, interviewee){
        interviewee.volunteer = did;
        interviewee.signTime = new Date();
        console.log(interviewee);
        Interviewee.addInterviewee(interviewee, cid, function (err) {
            if(err) {
                callback(err);
            } else {
                console.log(interviewee);
                callback(null, interviewee);
            }
        });
    });
};

exports.getNextInterviewee = function (cid, did, cb){
    Interviewee.getNextInterviewee(cid, did, function (err, interviewee){
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

exports.getSpecifyInterviewee = function (sid, cid, cb){
    Interviewee.getStuBySid(sid, cid, function (err, interviewee){
        if (!!interviewee){
            interviewee.busy = true;
            interviewee.save();
        }
        cb(err, interviewee);
    })
};

exports.rateInterviewee = function (cid, sid, score, commit, did, interviewer, cb){
    Interviewee.rateInterviewee(cid, sid, score, commit, did, interviewer, function (err){
        cb(err);
    })
};

exports.recommend = function (cid, sid, rdid, cb){
    Interviewee.recommend(cid, sid, rdid, function (err){
        cb(err);
    })
};

exports.getDepartmentQueueLength = function (cid, did, cb){
    Interviewee.countQueue(cid, did, function (err, count){
        cb(err, count);
    })
};

exports.getIntervieweeBySid = function (sid, cid, cb) {
    Interviewee.getStuBySid(sid, cid, function (err, doc) {
        cb(err, doc);
    });
};

exports.skip = function(cid, sid, cb){
    Interviewee.getStuBySid(sid, cid, function(err, doc){
        if(err) {
            cb(err);
        } else {
            doc.signTime = new Date();
            doc.save(function(err){
                if(err){
                    cb(err);
                }else{
                    cb(null);
                }
            });
        }
    })
};