let rp = require('request-promise');
let iconv = require('iconv-lite');
let unit = require('../static/lib/unit.json');
let IntervieweeModel = require('../models').Interviewee;
let clubModel = require('../models').Club;
let config = require('../config');


exports.getInterviewerInfo = function (sid, cid ) {
    return IntervieweeModel.findOneAndUpdate({
        sid: sid,
        cid: cid
    },{
        ifsign : true
    })
};

exports.delVolunteer = function (cid,sid, did) {
    return IntervieweeModel.findOneAndUpdate({
        cid:cid,
        sid:sid
    },{
        '$pull': {volunteer: did}
    })

}
//result.volunteer.splice(result.volunteer.indexOf(did), 1);
exports.getFinishInfo = function (cid) {
     return IntervieweeModel.find({
        cid:cid,
        ifsign : true,
        ifcall : true,
        busy: false
    }).then(result => result.length)
}

exports.selectDep = function (sid, cid, did) {
       return exports.getStuByApi(sid).then(result => {
            result.volunteer = did;
            result.sighTime = new Date();
            exports.addInterviewee(result, cid);
            return result;
        });
};




exports.getNextInterviewee = function (cid, did) {
        return IntervieweeModel.findOne({
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
            if(result === null) {
                return result
            }
            result.busy = true;
            result.ifcall = true;
            result.calldid = did;
            console.log(result)
            result.save(function (err) {
                console.log(err)
            });
            return result;
        });
};


exports.callNextInterviewee = function (cid) {
    return  IntervieweeModel.find({
        cid:cid,
        ifcall: true,
        signTime: {$ne: null},
        volunteer: {$elemMatch:{$ne:null}}
    }).sort({
        signTime: 'asc'
    })

};
//result.done.indexOf(did * 1) != -1
exports.getSignedInterviewee = function (cid) {
   return IntervieweeModel.find({
       cid:cid,
       signTime: {$ne: null},
       busy : false,
       volunteer: {$elemMatch:{$ne:null}}
   }).$where('this.volunteer.length != this.done.length')
};

exports.getClubInfo = function (info) {
    let result = {}
    let i = 4;
    info.forEach(e => {
        e.volunteer.forEach(a =>
            result[i] = a,
            i++
        )
    });
    console.log(result)
    // return clubModel.find({
    //     departments
    // })

}

exports.recoverInterviewee = function (sid, cid, did) {
        let data = {
            sid: sid,
            cid: cid,
            volunteer: did
        };
        return IntervieweeModel.findOne(data).then(result => {
            result.busy = false;
            result.save();
            return true;
        })
};


exports.getSpecifyInterviewee = function (sid, cid, did) {
        let data = {
                sid: sid,
                cid: cid,
                volunteer: did
        };
        return IntervieweeModel.findOne(data).then(result => {
            if (result.done.indexOf(did * 1) != -1) reject(new Error('该同学已进行过面试'));
            result.calldid = did;
            result.ifcall = true;
            result.busy = true;
            result.save();
            return result;
        })
};

exports.rateInterviewee =  function (cid, sid, score, comment, did, interviewer) {
    return IntervieweeModel.findOne({
            cid: cid,
            sid: sid
        }).then(result => {
            if (!result.rate)  result.rate = [];
            result.rate.push({
                did: did,
                score: String(score),
                comment: comment,
                interviewer: interviewer
            });
            let done = [].concat(result.done);
            done.push(did);
            result.done = done;
            result.busy = false;
            result.signTime = new Date();
            return result.save();
        });
};

exports.getDepartmentQueueLength = function (cid, did) {
        return IntervieweeModel.find({
            cid: cid,
            'volunteer.did': did,
            busy: {$ne: true},
            signTime: {$ne: null},
            done: {$ne: did}
        }).then(result => {
            return result.length;
        });
};



exports.getIntervieweeBySid = function (sid, cid) {
        let data = {
            sid: sid,
            cid: cid,
        };
        return IntervieweeModel.findOne(data).then(result => {
            return result;
        })
};


exports.skip = function (cid, sid, did) {
        let data = {
            sid: sid,
            cid: cid,
            volunteer: did
        };
        return IntervieweeModel.findOne(data).then(result => {
            result.signTime = new Date();
            result.busy = false;
            result.volunteer.splice(result.volunteer.indexOf(did), 1);
            result.save();
            return '跳过成功';
        })
};


exports.getStuByApi = function (sid) {
    let options = {
        uri: 'https://api.hdu.edu.cn/person/student/' + sid,
        headers: {
            'X-Access-Token': config.token
        },
        encoding: null
    };

    return rp(options).then(body => {
        console.log(body);
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
    let fields = ['sid', 'name', 'sex', 'major', 'phone', 'short_tel', 'qq', 'volunteer', 'notion', 'email'];
    fields.forEach(function (e) {
        IntervieweeEntity[e] = interviewee[e];
        delete interviewee[e];
    });
    IntervieweeEntity.cid = cid;
    if (!!interviewee.signTime) {
        IntervieweeEntity.signTime = interviewee.signTime;
        delete interviewee.signTime;
    }
    return IntervieweeEntity.save();
};

exports.addStudent = function (data) {
    let Interviewee = new IntervieweeModel({
        clubName: data.clubName,
        cid: data.cid,
        name: data.name,
        sid: data.sid,
        sex: data.sex,
        college: data.college,
        major: data.major,
        volunteer: data.volunteer,
        notion: data.notion,
        phone: data.phone,
        qq: data.qq,
        short_tel: data.short_tel,
        pic_url: data.pic_url,
        image: data.image,
        email: data.email
    });

    return Interviewee.save().then(result => {
        clubModel.findOne({
            cid: data.cid
        }).then(result => {
            result.departments.forEach(e => {
                data.volunteer.forEach(j => {
                    if(e.did === j) {
                        e.number ++;
                        return;
                    }
                })
            });
            result.save();
        })
    });
};

exports.queryByClubAll = function (cid) {
    return IntervieweeModel.find({
        cid: cid
    }).then(result => {
        if(!result) throw new Error('该社团没有人报名');
        return result;
    })
};

