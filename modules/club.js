/**
 * Created by bangbang93 on 14-9-16.
 */
let IntervieweeModel = require('../models').Interviewee;
let clubModel = require('../models').Club;
let studentModel = require('../models').Student;
let excel = require('xlsx');
let debug = require('debug')('interview');
let Interviewee = require('./interviewee');


exports.login = function (user, password) {
    return clubModel.findOne({
        name: user
    }).then(result => {
        if (result && password == result.password) {
            result = result.toObject();
            delete result.password;
            return result;
        } else {
            throw new Error('用户名或密码错误');
        }
    })
};
/**
 *
 * @param name
 * @param callback
 */
exports.getClubByName = function (name) {
    return clubModel.findOne({
        name: name
    });
};

exports.handleArchive = function (file, cid) {
    let count = 0;
    return clubModel.findOne({
        cid: cid
    }).then(clubInfo => {
        let department = clubInfo.departments;
        let interviewerInfo = [];
        let hearders = {};
        let workbook = excel.readFile(file.path);
        let workSheet = workbook.Sheets[workbook.SheetNames[0]];
        let keys = Object.keys(workSheet);
        let key = keys.filter(k => k[0] !== '!');
        key.forEach(k => {
            let col = k.substring(0, 1); //A
            let row = parseInt(k.substring(1)); //11
            let value = workSheet[k].v;
            if (row == 1) {
                switch (value) {
                    case '姓名':
                        hearders[col] = 'name';
                        break;
                    case '学号':
                        hearders[col] = 'sid';
                        break;
                    case '性别[0=女,1=男]':
                        hearders[col] = 'sex';
                        break;
                    case '专业':
                        hearders[col] = 'major';
                        break;
                    case '部门':
                        hearders[col] = 'volunteer';
                        break;
                    case '简介':
                        hearders[col] = 'notion';
                        break;
                    case '手机号':
                        hearders[col] = 'phone';
                        break;
                    case 'qq':
                        hearders[col] = 'qq';
                        break;
                    case '短号':
                        hearders[col] = 'short_tel';
                        break;
                    case '邮箱':
                        hearders[col] = 'email';
                        break;
                }
                return;
            }
            if (!interviewerInfo[row]) interviewerInfo[row] = {};
            if (hearders[col] == undefined) return;
            if (hearders[col] == 'volunteer') {
                let departInfo = value.split(',');
                let result = [];
                departInfo.forEach(e => {
                    let oneDepart = department.filter(k => {
                        return k.name == e
                    })[0];
                    result.push(oneDepart.did);
                });
                interviewerInfo[row][hearders[col]] = result;
            }
            else {
                interviewerInfo[row][hearders[col]] = value;
            }
        }); //interviewerInfo的长度永远多2个
        interviewerInfo = interviewerInfo.filter(e => {
            return e != undefined;
        });
        for (let interviewer of interviewerInfo) {
            count++;
            IntervieweeModel.findOne({
                sid: interviewer.sid,
                cid: cid
            }).then(result => {
                if (!!result) {
                    result.volunteer.forEach(e => {
                        interviewer.volunteer.forEach((i, j) => {
                            if (e == i) {
                                interviewer.volunteer[j] = null;
                            }
                        })
                    });
                    interviewer.volunteer = interviewer.volunteer.filter(e => {
                        return e != null;
                    });
                    result.volunteer = result.volunteer.concat(interviewer.volunteer);
                    result.save();
                } else {
                    Interviewee.addInterviewee(interviewer, cid);
                }
                interviewer.volunteer.forEach(e => {
                    clubInfo.departments.forEach(i => {
                        if(i.did == e)  {
                            i.number++;
                        }
                    })
                });
                clubInfo.save();
            });
        }
        return count;
    })
};

exports.createClub = function (data) {
    return clubModel.create(data);
};


exports.exportInterviewees = function (cid, did) {
    return IntervieweeModel.find({
        cid: cid,
        'rate.did': did
    }, 'name sid rate notion phone qq short_tel major sex email').then(result => {
        let newDocs = [];
        result.forEach(e => {
            e = e.toObject();
            for (let i in e.rate) {
                if (e.rate[i].did == did) {
                    e.rate = e.rate[i];
                    break;
                }
            }
            newDocs.push(e);
        });

        return result;
    })
};

exports.getClubInfo = function (cid) {
    return clubModel.findOne({
        cid: cid
    });
};

exports.verifyInfo = function (data) {
    return clubModel.findOne({
        cid: data.cid
    }).then(result => {
        if (!result || !(data.clubName == result.name)) throw new Error("社团id错误！");
        result = result.toObject();
        delete result.password;
        return result;
    });
};


exports.insertInfo = function (data) {
    let model = new clubModel(data);
    model.save().then(result => {
        return result;
    });
};

exports.getRegNum = function (clubId) {
    return studentModel.find({
        clubID: clubId
    }).then(result => {
        return {
            count: result.length
        }
    })
};

exports.setRoomLocation = function (cid, departmentId, roomLocation) {
    return clubModel.findOne({
        cid: cid
    }).then(result => {
        result.departments.forEach(e => {
            if(e.did == departmentId) {
                e.location = roomLocation;
            }
        });
        result.save();
    })
};

exports.initClub = function (cid) {
    return clubModel.findOne({cid: cid}).then(club => {
        let departments = club.departments;
        for(let department of departments) {
            department.number = 0
        }
        return club.save();
    })
}