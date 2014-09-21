var Interviewee = require('../models').Interviewee;

exports.getStuBySid = function (sid, cid, callback) {
    Interviewee.find({sid: sid,cid: cid},function (err, docs){
        callback(err, docs);
    });
}

exports.sign = function (sid, cid, callback) {
    var date = new Date();
    Interviewee.update({sid: sid,cid: cid},{signTime: date},function (err, numAffected){
        if(!err && 1==numAffected) {
            callback(null);
        } else {
            callback(err);
        }
    });
}

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