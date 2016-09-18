var Interviewee = require('../models/interviewee');
var request = require('request');
var iconv = require('iconv-lite');
var unit = require('../static/lib/unit.json');

exports.sign = function (sid, cid, callback) {
	Interviewee.getStuBySid(sid, cid, function (err, doc){
		if(err) {
			callback(err);
		} else {
			if(!doc) {
				callback(205);
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
    exports.getStuByAPI(sid, function (err, interviewee){
        if (err){
            return callback(err);
        }
        interviewee.volunteer = did;
        interviewee.signTime = new Date();
        Interviewee.addInterviewee(interviewee, cid, function (err) {
            if(err) {
                callback(err);
            } else {
                callback(null, interviewee);
            }
        });
    });9
};

exports.addDep = function (cid, interviewee, callback){
    Interviewee.addInterviewee(interviewee, cid, function (err) {
        if(err) {
            callback(err);
        } else {
            callback(null, interviewee);
        }
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
                cb (null, null);
            }
        }
    })
};

exports.recoverInterviewee = function(sid, cid, did,cb){
    Interviewee.getStuBySid(sid, cid, did, function (err, interviewee){
        if(!!interviewee){
            interviewee.busy = false;
            interviewee.save(function (err) {
                if (err) {
                    cb(500);
                } else {
                    cb(400);
                }
            });

        } else {
            cb(400);
        }
    });
};

exports.getSpecifyInterviewee = function (sid, cid, did, cb){
    Interviewee.getStuBySid(sid, cid, did, function (err, interviewee){
        if(err){
            cb(err);
        }
        else {
            if (!!interviewee && interviewee.done.indexOf(did * 1) == -1) {
                interviewee.busy = true;
                interviewee.save();
                cb(null, interviewee);
            }
            else {
                cb({
                    code: 404,
                    sid: sid
                });
            }
        }
    });
};

exports.rateInterviewee = function (cid, sid, score, comment, did, interviewer, cb){
    Interviewee.rateInterviewee(cid, sid, score, comment, did, interviewer, function (err){
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

exports.skip = function(cid, sid, did, cb){
    Interviewee.getStuBySid(sid, cid, function(err, doc){
        if(err) {
            cb(err);
        } else {
            doc.signTime = new Date();
            doc.busy = false;
            doc.volunteer.splice(doc.volunteer.indexOf(did), 1);
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

exports.getStuByAPI = function (sid, cb){
    request.get('https://api.hdu.edu.cn/person/student/' + sid, {
        encoding: null,
        headers: {
            'X-Access-Token': global.token
        }
    }, function (err, res, body) {
        if (err){
            return cb(err);
        } else {
            body = JSON.parse(body.toString());
            if (!body.STAFFID){
                return cb({
                    code: 404,
                    sid: sid
                });
            } else {
                return cb(null, {
                    sid: sid,
                    name: body.STAFFNAME,
                    major: body.MAJORCODE + "(" + unit[body.UNITCODE] + ")"
                })
            }
        }
    })
};

