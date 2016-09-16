/**
 * Created by bangbang93 on 14-9-16.
 */

var Club = require('../models/club');
var Interviewee = require('../models/interviewee');
var excel = require('xlsx');
var debug = require('debug')('interview');

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
        var departments = club.departments;
        var deps = {};
        departments.forEach(function (e){
             deps[e.name] = e.did;
        });
        debug(JSON.stringify(deps));
        process.nextTick(function () {
            Interviewee.removeByCid(cid, function (err){    //清空该社团所有已有资料
                if (err){
                    callback(err);
                }
                else {
                    var workbook = excel.readFile(file.path);
                    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    var refReg = /([A-Z])(\d+)(:)([A-Z])(\d+)/;
                    var refInfo = refReg.exec(worksheet['!ref']);
                    var rows = refInfo[4];
                    var letterSeq = [];
                    for(var i = refInfo[0].charCodeAt(0) - 55; (i - 1).toString(36).toUpperCase() != rows; i++){   //生成Excel列的字母序列
                        letterSeq.push(i.toString(36).toUpperCase());
                    }
                    var startCol = parseInt(refInfo[2]);
                    var endCol = parseInt(refInfo[5]);
                    var title = [];
                    for (var key in worksheet){
                        if(new RegExp("[A-Z]" + refInfo[2]).test(key)) {    //判断是否为首行
                            var cell = worksheet[key].v;
                            switch (cell.toLowerCase()) {
                                case '学号':
                                    title.push('sid');
                                    break;
                                case '姓名':
                                    title.push('name');
                                    break;
                                case '性别':
                                    title.push('sex');
                                    break;
                                case '专业':
                                    title.push('major');
                                    break;
                                case '电话':
                                    title.push('phone');
                                    break;
                                case '邮箱':
                                    title.push('email');
                                    break;
                                case 'qq':
                                    title.push('qq');
                                    break;
                                case '感想':
                                    title.push('notion');
                                    break;
                                default:
                                    var volunteerReg = /志愿(\d)+/;
                                    if (volunteerReg.test(cell)) {
                                        title.push('volunteer');
                                        break;
                                    } else {
                                        title.push(cell);
                                    }
                            }
                        }
                    }
                    var interviewee;
                    for (var colNum = startCol + 1; colNum <= endCol; colNum++){
                        interviewee = {};
                        for(var rowNum = 0; rowNum < letterSeq.length; rowNum++){
                            var cellName = letterSeq[rowNum] + colNum;
                            if(cellName in worksheet) {  //空白单元格不会出现在worksheet中，因此需要事先检测
                                if (title[rowNum] != 'volunteer'){
                                    interviewee[title[rowNum]] = worksheet[cellName].v;
                                }
                                else {
                                    var d = deps[worksheet[cellName].v];
                                    if (!isNaN(d * 1)) {
                                        if (!interviewee['volunteer']) {
                                            interviewee['volunteer'] = [];
                                        }
                                        if (interviewee['volunteer'].indexOf(d) == -1) {
                                            interviewee['volunteer'].push(d);
                                        }
                                        else {
                                            return callback({
                                                code: 404,
                                                line: colNum,
                                                interviewee: interviewee
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        if(isNaN((interviewee['sid'] + interviewee['sex'] + interviewee['phone'] + interviewee['qq']) * 1)) { //判断这四项是否都是数字
                            return callback({
                                code: 404,
                                line: colNum,
                                interviewee: interviewee
                            });
                        }
                        Interviewee.addInterviewee(interviewee, cid, function (err){
                            if (err){
                                return callback(err);
                            }
                        });

                    }

                    callback(null, colNum);
                }
            });
        });
    })
};
exports.update = function (cid, data, callback) {
    var pro = ['name','logo','departments','interviewer','password','maxDep'];
    var newClub = {};
    var hasDepartmentModify = false;

    if(undefined != data) {
        for(var i in pro) {
            if (pro.hasOwnProperty(i)){
                if(undefined != data[pro[i]]) {
                    if (pro[i] == 'departments') {
                        newClub[pro[i]] = [];
                        Club.getClubById(cid, function (err, club){
                            if (err){
                                return callback(err);
                            } else {
                                var dep = data['departments'];
                                var oldDep = club.departments;
                                if (dep.length == oldDep.length){
                                    for (var j = 0; j< dep.length ;j++){
                                        if (dep[j].name != oldDep.name){
                                            hasDepartmentModify = true;
                                            break;
                                        }
                                    }
                                } else {
                                    hasDepartmentModify = true;
                                }
                            }
                            if (hasDepartmentModify){
                                Interviewee.removeByCid(cid, function (err){
                                    if (err){
                                        callback(err);
                                    } else {
                                        callback(null, true);
                                    }
                                })
                            } else {
                                callback(null, false);
                            }
                        });
                        data[pro[i]].forEach(function (e, index){
                            var dep = {};
                            dep.did = index;
                            dep.name = e.name;
                            dep.location = e.location;
                            newClub[pro[i]].push(dep);
                        })

                    } else {
                        newClub[pro[i]] = data[pro[i]];
                    }

                }
            }
        }
    }
    Club.update(cid, newClub, function (err){
        if (err) {
            callback(err);
        }
    });
};

exports.exportInterviewees = function (cid, did, cb){
    Interviewee.exportByDid(cid, did, function (err, docs){
        var newDocs = [];
        docs.forEach(function (e){
            e = e.toObject();
            for (var i = 0;i< e.rate.length;i++){
                if (e.rate[i].did == did){
                    e.rate = e.rate[i];
                    break;
                }
            }
            newDocs.push(e);
        });
        cb(err ,newDocs);
    })
};