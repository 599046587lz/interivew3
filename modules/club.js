/**
 * Created by bangbang93 on 14-9-16.
 */

var Club = require('../models/club');
var Interviewee = require('../models/interviewee');
var excel = require('excel');

exports.login = function (user, pwd, callback){
    Club.login(user, pwd, function (err, success){
        if (err){
            return callback(err);
        } else {
            return callback(null, success);
        }
    })
};

/**
 *
 * @param name
 * @param callback
 */
exports.getClubByName = function (name, callback){
    Club.getClubByName(name, function (err, club){
        if (err){
            return callback(err);
        } else {
            if (!!club){
                return callback(null, club);
            } else {
                return callback(null, false);
            }
        }
    })
};

exports.getClubById = function (cid, cb){
    Club.getClubById(cid, function (err, club){
        cb(err, club);
    })
};

exports.handleArchive = function (file, cid, callback){
    Club.getClubById(cid, function (err, club){
        console.log(club);
        var departments = club.departments;
        var deps = {};
        departments.forEach(function (e){
             deps[e.name] = e.did;
        });
        process.nextTick(function () {
            excel(file.path, function (err, data){
                if (err){
                    return callback(err);
                } else {
                    var title = [];
                    var isFirstLine = true;
                    data.forEach(function (e){
                        if (isFirstLine){
                            e.forEach(function (e){
                                switch (e.toLowerCase()) {
                                    case '学号':
                                        title.push('sid'); break;
                                    case '姓名':
                                        title.push('name'); break;
                                    case '性别':
                                        title.push('sex'); break;
                                    case '专业':
                                        title.push('major'); break;
                                    case '电话':
                                        title.push('phone'); break;
                                    case '邮箱':
                                        title.push('email'); break;
                                    case 'qq':
                                        title.push('qq'); break;
                                    case '感想':
                                        title.push('message'); break;
                                    default:
                                        var volunteerReg = /志愿(\d)+/;
                                        if (volunteerReg.test(e)){
//                                    var number = volunteerReg.match(e)[1];
                                            title.push('volunteer'); break;
                                        } else {
                                            title.push(e);
                                        }
                                }
                            });
                            isFirstLine = false;
                        } else {
                            for (var i=0;i<e.length;i++){
                                var interviewee = {};
                                if (title[i] != 'volunteer') {
                                    interviewee[title[i]] = e[i];
                                } else {
                                    var d = deps[e[i]];
                                    if (!!d){
                                        if (!interviewee[title[i]]){
                                            interviewee[title[i]] = [];
                                        }
                                        interviewee[title[i]].push(d);
                                    } else {
                                        callback({
                                            code: 404,
                                            line: i,
                                            interviewee: interviewee
                                        });
                                    }
                                }
                                console.log(interviewee);
                                Interviewee.addInterviewee(interviewee, cid, function (err){
                                    if (err){
                                        return callback(err);
                                    }
                                })
                            }
                        }
                    });
                    callback(null, data.length);
                }
            });
        });
    })
};

exports.update = function (cid, club, callback) {
    var pro = ['name','logo','departments','interviewer','password','maxDep'];
    var newClub = {};

    for(var i in pro) {
        if(undefined != club[pro[i]]) {
            newClub[pro[i]] = club[pro[i]];
        }
    }

    Club.update(cid,newClub,function (err){
        callback(err);
    });
};

exports.exportInterviewees = function (cid, did, cb){
    Interviewee.exportByDid(cid, did, function (err, docs){
        docs.forEach(function (e, index){
            docs[index] = e.toObject();
        });
        cb(err ,docs);
    })
};