var Interviewee = require('../models').Interviewee;

exports.getStuBySid = function (sid, cid, did, callback) {
    var data = {
        sid: sid,
        cid: cid
    };
    if (typeof did == 'function') {
        callback = did;
        did = null;
    } else {
        data['did'] = did;
    }
    Interviewee.findOne(data, function (err, doc){
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
};

exports.addInterviewee = function (data, cid, callback){
    var IntervieweeEntity = new Interviewee();
    var interviewee = {};
    for(var i in data) {
        if (data.hasOwnProperty(i)){
            interviewee[i] = data[i];
        }
    }
    var fields = ['sid', 'name', 'sex', 'major', 'phone', 'email', 'qq', 'volunteer', 'notion'];
    fields.forEach(function (e){
        IntervieweeEntity[e] = interviewee[e];
        delete interviewee[e];
    });
    IntervieweeEntity.cid = cid;
    if (!!interviewee.signTime){
        IntervieweeEntity.signTime = interviewee.signTime;
        delete interviewee.signTime;
    }
    IntervieweeEntity.extra = interviewee;
    IntervieweeEntity.save();
    callback();
};

exports.getNextInterviewee = function (cid, did, cb){
    Interviewee.findOne({
        cid: cid,
        volunteer: did,
        busy: false,
        signTime:{$ne:null}
    }).$where(new Function('var volunteer = this.volunteer;' +
    'var done = this.done;' +
    'return (volunteer.length != done.length) && (done.indexOf(' + did + ') == -1);'
    )).sort({
        signTime: 'asc'
    }).exec(function (err, doc){
        if (err){
            cb(err);
        } else {
            if (!!doc){
                doc.busy = true;
                doc.save();
                cb(null, doc);
            } else {
                cb(null ,null);
            }
        }
    });
};

exports.rateInterviewee = function (cid, sid, score, comment, did, interviewer, cb){
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
                if (!doc.rate){
                    doc.rate = [];
                }
                doc.rate.push({
                    did: did,
                    score: score,
                    comment: comment,
                    interviewer: interviewer
                });
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
        volunteer: did,
        busy: {$ne:true},
        signTime: {$ne: null},
        done: {$ne:did}
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

exports.removeByCid = function (cid, cb){
    Interviewee.remove({
        cid: cid
    }, function (err, result){
        if (err) {
            cb(err);
        } else {
            cb(null, result.nRemoved);
        }
    })
};