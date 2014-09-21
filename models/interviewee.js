/**
 * Created by bangbang93 on 14-9-21.
 */

var Interviewee = require('../models').Interviewee;

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