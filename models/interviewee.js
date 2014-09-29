var Interviewee = require('../models').Interviewee;

exports.getStuBySid = function (sid, cid, callback) {
    Interviewee.find({sid: sid,cid: cid},function (err, docs){
        callback(err, docs);
    });
};

exports.sign = function (sid, cid, callback) {
    var date = new Date();
    Interviewee.update({sid: sid,cid: cid},{signTime: date},function (err, numAffected){
        if(!err && 1==numAffected) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.addInterviewee = function (data, cid, callback){
    var IntervieweeEntity = new Interviewee();
    IntervieweeEntity.sid = data.sid;
    IntervieweeEntity.cid = cid;
    IntervieweeEntity.name = data.name;
    IntervieweeEntity.sex = data.sex;
    IntervieweeEntity.major = data.major;
    IntervieweeEntity.phone = data.phone;
    IntervieweeEntity.email = data.email;
    IntervieweeEntity.qq = data.qq;
    IntervieweeEntity.volunteer = data.volunteer;
    IntervieweeEntity.notion = data.notion;
    IntervieweeEntity.extra = data;
    IntervieweeEntity.save();
    callback();
};

exports.getNextInterviewee = function (did, cb){
    Interviewee.findOne({
        volunteer: [did],
        busy: false,
        $where: function(){
            var volunteer = this.volunteer;
            var done = this.done;
            return volunteer.sort().toString() != done.sort().toString();
        }
    }, function (err, doc){
        if (err){
            cb(err);
        } else {
            if (doc){
                cb(null, doc);
            } else {
                cb(null ,null);
            }
        }
    })
};

exports.rateInterviewee = function (sid, score, commit, did, cb){
    Interviewee.findOne({
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
                    commit: commit
                };
                doc.done.push(did);
                doc.save();
                cb();
            }
        }
    })
};

exports.recommend = function (sid, rdid, cb){
    Interviewee.findOne({
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