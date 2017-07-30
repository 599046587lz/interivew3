/**
 * Created by bangbang93 on 14-9-16.
 */
let IntervieweeModel = require('../models').Interviewee;
let clubModel = require('../models').Club;
let Club = require('../models/club');
let Interviewee = require('../models/interviewee');
let excel = require('xlsx');
let debug = require('debug')('interview');

// exports.login = function (user, pwd, callback){
//     Club.login(user, pwd, function (err, success){
//         if (err){
//             return callback(err);
//         } else {
//             return callback(null, success);
//         }
//     })
// };

exports.login = function(user, password) {
    return new Promise(function(resolve, reject) {
        clubModel.findOne({
            name:user
        }).then(result => {
            if(password == result.password) {
                resolve(result);
            } else {
                reject(new Error('用户名或密码错误'));
            }
        }).catch(err => {
            reject(new Error('用户名或密码错误'));
        })
    })
};
/**
 *
 * @param name
 * @param callback
 */
// exports.getClubByName = function (name, callback){
//     Club.getClubByName(name, function (err, club){
//         if (err){
//             return callback(err);
//         } else {
//             if (!!club){
//                 return callback(null, club);
//             } else {
//                 return callback(null, false);
//             }
//         }
//     })
// };

exports.getClubByName = function(name) {
    return new Promise(function(resolve, reject) {
        clubModel.findOne({
            name: name
        }).then(result => {
            result = result.toObject();
            delete result.password;
            resolve(result);
        }).catch(err => {
            reject(new Error('数据库访问错误'));
        })
    })
};

exports.getClubById = function (cid, cb){
    Club.getClubById(cid, function (err, club){
        cb(err, club);
    })
};

exports.handleArchive = function (file, cid, callback){
    Club.getClubById(cid, function (err, club){
        let departments = club.departments;
        let deps = {};
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
                    let workbook = excel.readFile(file.path);
                    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    let refReg = /([A-Z])(\d+)(:)([A-Z])(\d+)/;
                    let refInfo = refReg.exec(worksheet['!ref']);
                    let rows = refInfo[4];
                    let letterSeq = [];
                    for(let i = refInfo[0].charCodeAt(0) - 55; (i - 1).toString(36).toUpperCase() != rows; i++){   //生成Excel列的字母序列
                        letterSeq.push(i.toString(36).toUpperCase());
                    }
                    let startCol = parseInt(refInfo[2]);
                    let endCol = parseInt(refInfo[5]);
                    let title = [];
                    for (let key in worksheet){
                        if(new RegExp("[A-Z]" + refInfo[2] + "$").test(key)) {    //判断是否为首行
                            let cell = worksheet[key].v;
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
                                    let volunteerReg = /志愿(\d)+/;
                                    if (volunteerReg.test(cell)) {
                                        title.push('volunteer');
                                        break;
                                    } else {
                                        title.push(cell);
                                    }
                            }
                        }
                    }
                    let interviewee;
                    for (let colNum = startCol + 1; colNum <= endCol; colNum++){
                        interviewee = {};
                        for(let rowNum = 0; rowNum < letterSeq.length; rowNum++){
                            let cellName = letterSeq[rowNum] + colNum;
                            if(cellName in worksheet) {  //空白单元格不会出现在worksheet中，因此需要事先检测
                                if (title[rowNum] != 'volunteer'){
                                    interviewee[title[rowNum]] = worksheet[cellName].v;
                                }
                                else {
                                    let d = deps[worksheet[cellName].v];
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
                        if(isNaN((interviewee['sid'] + interviewee['sex'] + interviewee['phone'] + (interviewee['qq'] || 1) * 1))) { //判断这四项是否都是数字
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

exports.update = function(cid, data) {
    return new Promise(function(resolve, reject) {
        IntervieweeModel.remove({
            cid: cid
        }).then(result => {
            clubModel.findOneAndUpdate({
                cid: cid
            }, data).then(result => {
                resolve(result);
            }).catch(err => {
                reject(new Error('数据库操作失败'));
            })
        })
    })
};



exports.exportInterviewees = function (cid, did) {
    return new Promise(function(resolve, reject) {
        IntervieweeModel.find({
            cid: cid,
            'rate.did': did
        }, 'name sid rate notion phone qq email major sex').then(result => {
            let newDocs = [];
            result.forEach(e => {
                e = e.toObject();
                for(let i in e.rate) {
                    if(e.rate[i].did == did) {
                        e.rate = e.rate[i];
                        break;
                    }
                }
                newDocs.push(e);
            });

            resolve(result);
        }).catch(err => {
            reject(new Error('数据库操作错误'));
        })
    })
};

exports.getClubInfo = function(cid) {
    // let info = Club.getInfo(cid);
    // console.log(info);
    // let result = [];
    // info.departments.forEach(e => {
    //     let department = {};
    //     department.name = e.name;
    // });
    // return result;
    return new Promise(function(resolve, reject) {
        let info = [];
        clubModel.findOne({
            cid: cid
        }).then(result => {
            result.departments.forEach(e => {
                info.push({
                    name: e.name
                });
            });
            resolve(info);
        }).catch(err => {
            reject(err);
        })
    })
};

exports.verifyInfo = function(info) {
  return new Promise(function(resolve, reject) {
      clubModel.findOne({
          cid: info.cid
      }).then(result => {
          if(!(info.name == result.name)) reject("社团id错误");
          result.password = null;
          resolve(result);
      }).catch(err => {
          reject(err);
      })
  })
};