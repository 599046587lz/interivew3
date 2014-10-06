var Interviewee = require('../models').Interviewee;
var request = require('request');

exports.getStuBySid = function (sid, cid, callback) {
    Interviewee.findOne({sid: sid,cid: cid},function (err, doc){
        callback(err, doc);
    });
};

exports.sign = function (sid, cid, callback) {
    var date = new Date();
    Interviewee.findOneAndUpdate({
        sid: sid,
        cid: cid
    },{
        signTime: date
    }, function (err, doc){
        if (err){
            callback(err);
        } else {
            if (!!doc){
                callback(null, doc);
            } else {
                callback(null, false);
            }
        }
    });
//    Interviewee.update({sid: sid,cid: cid},{signTime: date},function (err, numAffected){
//        if(!err && 1==numAffected) {
//            callback(null);
//        } else {
//            callback(err);
//        }
//    });
};

exports.addInterviewee = function (data, cid, callback){
    var IntervieweeEntity = new Interviewee();
    var fields = ['sid', 'name', 'sex', 'major', 'phone', 'email', 'qq', 'volunteer', 'notion'];
    fields.forEach(function (e){
        IntervieweeEntity[e] = data[e];
        delete data[e];
    });
    IntervieweeEntity.cid = cid;
//    IntervieweeEntity.sid = data.sid;
//    IntervieweeEntity.cid = cid;
//    IntervieweeEntity.name = data.name;
//    IntervieweeEntity.sex = data.sex;
//    IntervieweeEntity.major = data.major;
//    IntervieweeEntity.phone = data.phone;
//    IntervieweeEntity.email = data.email;
//    IntervieweeEntity.qq = data.qq;
//    IntervieweeEntity.volunteer = data.volunteer;
//    IntervieweeEntity.notion = data.notion;
    IntervieweeEntity.extra = data;
    IntervieweeEntity.save();
    callback();
};

exports.getNextInterviewee = function (cid, did, cb){
    Interviewee.findOne({
        cid: cid,
        volunteer: did,
        busy: false,
        $where: function(){
            var volunteer = this.volunteer;
            var done = this.done;
            return volunteer.length != done.length;
        }
    }).sort({
        signTime: 'asc'
    }).exec(function (err, doc){
        if (err){
            cb(err);
        } else {
            if (!!doc){
                doc.busy = true;
                cb(null, doc);
            } else {
                cb(null ,null);
            }
        }
    });
};

exports.rateInterviewee = function (cid, sid, score, commit, did, interviewer, cb){
    Interviewee.findOne({
        cid: cid,
        sid: sid
    },function (err, doc){
        if (err){
            return cb(err);
        } else {
            if (!doc){
                return cb({
                    message:'could not find interviewee',
                    code: 1
                });
            } else {
                doc.rate['did'] = {
                    score: score,
                    commit: commit,
                    interviewer: interviewer
                };
                doc.done.push(did);
                doc.busy = false;
                doc.save();
                cb();
            }
        }
    })
};

exports.recommend = function (cid, sid, rdid, cb){
    Interviewee.findOne({
        cid: cid,
        sid: sid
    }, function (err, doc){
        if (err){
            return cb(err);
        } else {
            if (!doc){
                return cb({
                    message:'could not find interviewee',
                    code: 1
                });
            } else {
                doc.volunteer.push(rdid);
                doc.save();
                cb();
            }
        }
    })
};

exports.countQueue = function (cid, did, cb){
    Interviewee.find({
        cid: cid,
        volunteer: [did],
        'done.count': {$ne: 'volunteer.count'},
        signTime: {$ne: null}
    }, function (err, doc){
        if (err){
            cb(err);
        } else {
            cb(null, doc.length);
        }
    })
};

exports.exportByDid = function (cid, did, cb){
    Interviewee.find({
        cid: cid,
        volunteer: did
    }, function (err, docs){
        if (err){
            return cb(err);
        } else {
            cb(null, docs);
        }
    })
};

exports.getStuByAPI = function (sid, cb){
    request.get('http://portal.hdu.edu.cn/eapdomain/peopleservlet?id=' + sid + '&key=hduredhome2007neusoft', function (err, res, body){
        if (err){
            return cb(err);
        } else {
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