let Interviewee = require('../models').Interviewee;

exports.getStuBySid = function (sid, cid, did, callback) {
    let data = {
        sid: sid,
        cid: cid
    };
    if (typeof did == 'function') {
        callback = did;
        did = null;
    } else {
        data['volunteer'] = did;
    }
    Interviewee.findOne(data, function (err, doc){
        callback(err, doc);
    });
};

exports.sign = function (sid, cid, callback) {

    Interviewee.findOne({
        sid: sid,
        cid: cid,
    }).exec(function(err,doc){
        if(err)
            callback(err);
        else{
            if(!doc){
                callback(205);
            }
            else{
                if(doc.signTime){
                    callback(204);
                }
                else{
                    doc.signTime = new Date();
                    doc.save();
                    callback(null, doc);
                }
            }
        }
    });
};

// exports.addInterviewee = function (data, cid, callback){
//     let IntervieweeEntity = new Interviewee();
//     let interviewee = {};
//     for(let i in data) {
//         if (data.hasOwnProperty(i)){
//             interviewee[i] = data[i];
//         }
//     }
//     let fields = ['sid', 'name', 'sex', 'major', 'phone', 'email', 'qq', 'volunteer', 'notion'];
//     fields.forEach(function (e){
//         IntervieweeEntity[e] = interviewee[e];
//         delete interviewee[e];
//     });
//     IntervieweeEntity.cid = cid;
//     if (!!interviewee.signTime){
//         IntervieweeEntity.signTime = interviewee.signTime;
//         delete interviewee.signTime;
//     }
//     IntervieweeEntity.extra = interviewee;
//     IntervieweeEntity.save(function (err){
//         callback(err);
//     });
//
// };

//let getLock = false;
exports.getNextInterviewee = function (cid, did, cb){
//    if (!getLock){
//        return process.nextTick((function (cid, did, cb){
//            return function (){
//                exports.getNextInterviewee(cid, did, cb);
//            }
//        })(cid ,did, cb));
//    } else {
//        getLock = true;
        Interviewee.findOne({
            cid: cid,
            volunteer: did,
            busy: false,
            signTime:{$ne:null}
        }).$where(new Function('let volunteer = this.volunteer;' +
                'let done = this.done;' +
                'return (volunteer.length != done.length) && (done.indexOf(' + did + ') == -1);'
        )).sort({
            signTime: 'asc'
        }).exec(function (err, doc){
            if (err){
                cb(err);
//                getLock = false;
            } else {
                if (!!doc){
                    doc.busy = true;
                    doc.save(function (){
//                        getLock = false;
                    });
                    cb(null, doc);
                } else {
                    cb(null ,null);
//                    getLock = false;
                }
            }
        });
//    }
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
                doc.signTime = new Date();
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
        'rate.did': did
    }, 'name sid rate notion phone qq email major sex', function (err, docs){
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