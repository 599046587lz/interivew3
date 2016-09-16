var Interviewee = require('../models/interviewee');
var request = require('request');
var iconv = require('iconv-lite');

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

exports.addDep = function (sid, name, cid, did, callback){
    var interviewee = {
        sid: sid,
        volunteer: did,
        name: name,
        signTime: new Date()
    };
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
        if (!!interviewee){
            interviewee.busy = true;
            interviewee.save();
        } else {
            cb({
                code: 404,
                sid: sid
            })
        }
        cb(err, interviewee);
    })
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
    request.get('http://portal.hdu.edu.cn/eapdomain/peopleservlet?id=' + sid + '&key=hduredhome2007neusoft', {
        encoding: null
    }, function (err, res, body) {
        if (err){
            return cb(err);
        } else {
            body = iconv.decode(body, 'gbk');
            var reg = /<user_type>(.*?)<\/user_type><user_id>(.*?)<\/user_id><user_name>(.*?)<\/user_name><user_birth>(.*?)<\/user_birth><user_depart>(.*?)<\/user_depart><user_special>(.*?)<\/user_special>/;
            var match = reg.exec(body);
            if (match[1] == 0){
                return cb({
                    code: 404,
                    sid: sid
                });
            } else {
                return cb(null, {
                    sid: sid,
                    name: match[3],
                    major: match[6]
                })
            }
        }
    })
};

