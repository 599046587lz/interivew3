

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