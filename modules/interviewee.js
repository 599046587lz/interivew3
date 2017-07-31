let request = require('request');
let iconv = require('iconv-lite');
let unit = require('../static/lib/unit.json');
let IntervieweeModel = require('../models').Interviewee;


exports.sign = function (sid, cid) {
    return new Promise(function (resolve, reject) {
        IntervieweeModel.findOne({
            sid: sid,
            cid: cid
        }).then(result => {
            if (result.sighTime) resolve(204);
            result.sighTime = new Date();
            result.save();
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
};


exports.selectDep = function (sid, cid, did) {
    return new Promise(function(resolve, reject) {
        exports.getStuByApi(sid).then(result => {
            result.volunteer = did;
            result.sighTime = new Date();
            exports.addInterviewee(result, cid);
            resolve(result);
        }).catch(err => {
            reject(new Error('数据库操作错误'));
        })
    });
};


exports.addDep = function(cid, interviewee) {
    return new Promise(function(resolve, reject) {
        exports.addInterviewee(interviewee, cid).then(result => {
            resolve();
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};


exports.getNextInterviewee = function (cid, did) {
    return new Promise(function (resolve, reject) {
        IntervieweeModel.findOne({
            cid: cid,
            volunteer: did,
            busy: false,
            signTime: {$ne: null}
        }).$where(new Function('let volunteer = this.volunteer;' +
            'let done = this.done;' +
            'return (volunteer.length != done.length) && (done.indexOf(' + did + ') == -1);'
        )).sort({
            signTime: 'asc'
        }).then(result => {
            result.busy = true;
            result.save();
            resolve(result);
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    });
};



exports.recoverInterviewee = function (sid, cid, did) {
    return new Promise(function (resolve, reject) {
        let data = {
            sid: sid,
            cid: cid,
            volunteer: did
        };
        IntervieweeModel.findOne(data).then(result => {
            result.busy = false;
            result.save();
            resolve();
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};


exports.getSpecifyInterviewee = function (sid, cid, did) {
    return new Promise(function (resolve, reject) {
        let data = {
            sid: sid,
            cid: cid,
            volunteer: did
        };
        IntervieweeModel.findOne(data).then(result => {
            if (result.done.indexOf(did * 1) != -1) reject(new Error('该同学已进行过面试'));
            result.busy = true;
            result.save();
            resolve(result);
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};

exports.rateInterviewee = function (cid, sid, score, comment, did, interviewer) {
    return new Promise(function (resolve, reject) {
        IntervieweeModel.findOne({
            cid: cid,
            sid: sid
        }).then(result => {
            if (!result.rate) result.rate = [];
            result.rate.push({
                did: did,
                score: score,
                comment: comment,
                interviewer: interviewer
            });
            result.done.push(did);
            result.busy = false;
            result.signTime = new Date();
            result.save();
            resolve('评论成功');
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};


exports.recommend = function (cid, sid, departmentId) {
    return new Promise(function (resolve, reject) {
        IntervieweeModel.findOne({
            cid: cid,
            sid: sid
        }).then(result => {
            if (result.volunteer.indexOf(departmentId) >= 0) reject(new Error('不能重复推荐部门'));
            result.volunteer.push(departmentId);
            result.save();

            resolve('更新成功');
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};



exports.getDepartmentQueueLength = function (cid, did) {
    return new Promise(function (resolve, reject) {
        IntervieweeModel.find({
            cid: cid,
            volunteer: did,
            busy: {$ne: true},
            signTime: {$ne: null},
            done: {$ne: did}
        }).then(result => {
            resolve(result.length);
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};



exports.getIntervieweeBySid = function (sid, cid) {
    return new Promise(function(resolve, reject) {
        let data = {
            sid: sid,
            cid: cid,
        };
        IntervieweeModel.findOne(data).then(result => {
            resolve(result);
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};


exports.skip = function (cid, sid, did) {
    return new Promise(function (resolve, reject) {
        let data = {
            sid: sid,
            cid: cid,
            volunteer: did
        };
        IntervieweeModel.findOne(data).then(result => {
            result.signTime = new Date();
            result.busy = false;
            result.volunteer.splice(result.volunteer.indexOf(did), 1);
            result.save();
            resolve('跳过成功');
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};


exports.getStuByApi = function (sid) {
    request.get('https://api.hdu.edu.cn/person/student/' + sid, {
        encoding: null,
        headers: {
            'X-Access-Token': global.token
        }
    }).then(body => {
        body = JSON.parse(body.toString());
        if (!body.STAFFID) reject(new Error('不存在该学生'));
        let result = {
            sid: sid,
            name: body.STAFFNAME,
            major: body.MAJORCODE + "(" + unit[body.UNITCODE] + ")"
        };
        return result;
    }).catch(err => {
        return (new Error('API访问错误'));
    });
};

exports.addInterviewee = function (data, cid) {
    let IntervieweeEntity = new IntervieweeModel();
    let interviewee = {};
    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            interviewee[i] = data[i];
        }
    }
    let fields = ['sid', 'name', 'sex', 'major', 'phone', 'email', 'qq', 'volunteer', 'notion'];
    fields.forEach(function (e) {
        IntervieweeEntity[e] = interviewee[e];
        delete interviewee[e];
    });
    IntervieweeEntity.cid = cid;
    if (!!interviewee.signTime) {
        IntervieweeEntity.signTime = interviewee.signTime;
        delete interviewee.signTime;
    }
    IntervieweeEntity.extra = interviewee;
    return IntervieweeEntity.save();
};

