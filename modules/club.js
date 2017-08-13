/**
 * Created by bangbang93 on 14-9-16.
 */
let IntervieweeModel = require('../models').Interviewee;
let clubModel = require('../models').Club;
let excel = require('xlsx');
let debug = require('debug')('interview');


exports.login = function (user, password) {
    return clubModel.findOne({
        name: user
    }).then(result => {
        if (password == result.password) {
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
    }).then(result => {
        result = result.toObject();
        delete result.password;
        return result;
    })
};

exports.handleArchive = function (file, cid) {
    return clubModel.findOne({
        cid: cid
    }).then(result => {
        let department = result.departments;
        let interviewerInfo = [];
        let hearders = {};
        let workbook = excel.readFile(file.path);
        let workSheet = workbook.Sheets[workbook.SheetNames[0]];
        let keys = Object.keys(workSheet);
        let key = keys.filter(k => k[0] !== '!');
        key.forEach(k => {
            let col = k.substring(0, 1);
            let row = parseInt(k.substring(1));
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
                }
                return;
            }
            if (!interviewerInfo[row]) interviewerInfo[row] = {};
            if (hearders[col] == undefined) return;
            if(hearders[col] == 'volunteer') {
                let mid = {};
                let result = [];
                let departmentArray = value.split(',');
                departmentArray.forEach(e => {
                    let Dep = e.split('-');
                    if(!mid[Dep[0]]) {mid[Dep[0]] = {}; mid[Dep[0]].column = [];}
                    mid[Dep[0]].column.push({columnName: Dep[1]});
                });
                for(let i in mid) {
                    let oneDepart = department.filter(k => {return k.name = i});
                    oneDepart[0].column = mid[i].column;
                    result.push(oneDepart);
                }
                interviewerInfo[row][hearders[col]] = result;
            } else {
                interviewerInfo[row][hearders[col]] = value;
            }
        }); //interviewerInfo的长度永远多2个
        console.log(interviewerInfo[2].volunteer);
    });
    /**/
};

// exports.handleArchive = function (file, cid) {
//     let deps = {};
//     return clubModel.findOne({
//         cid: cid
//     }).then(result => {
//         let departments = result.departments;
//         departments.forEach(e => {
//             deps[e.name] = e.did;
//         });
//         process.nextTick(function () {
//             IntervieweeModel.remove({
//                 cid: cid
//             })
//         })
//     }).then(result => {
//         let workbook = excel.readFile(file.path);
//         let worksheet = workbook.Sheets[workbook.SheetNames[0]];
//         let refReg = /([A-Z])(\d+)(:)([A-Z])(\d+)/;
//         let refInfo = refReg.exec(worksheet['!ref']);
//         let rows = refInfo[4];
//         let letterSeq = [];
//         for (let i = refInfo[0].charCodeAt(0) - 55; (i - 1).toString(36).toUpperCase() != rows; i++) {   //生成Excel列的字母序列
//             letterSeq.push(i.toString(36).toUpperCase());
//         }
//         let startCol = parseInt(refInfo[2]);
//         let endCol = parseInt(refInfo[5]);
//         let title = [];
//         for (let key in worksheet) {
//             if (new RegExp("[A-Z]" + refInfo[2] + "$").test(key)) {    //判断是否为首行
//                 let cell = worksheet[key].v;
//                 switch (cell.toLowerCase()) {
//                     case '学号':
//                         title.push('sid');
//                         break;
//                     case '姓名':
//                         title.push('name');
//                         break;
//                     case '性别[0=女,1=男]':
//                         title.push('sex');
//                         break;
//                     case '专业':
//                         title.push('major');
//                         break;
//                     case '手机号':
//                         title.push('phone');
//                         break;
//                     case '短号':
//                         title.push('short_tel');
//                         break;
//                     case 'qq':
//                         title.push('qq');
//                         break;
//                     case '简介':
//                         title.push('notion');
//                         break;
//                     case '部门':
//                         title.push('volunteer')
//                         break;
//                 }
//             }
//         }
//         let interviewee;
//         for (let colNum = startCol + 1; colNum <= endCol; colNum++) {
//             interviewee = {};
//             for (let rowNum = 0; rowNum < letterSeq.length; rowNum++) {
//                 let cellName = letterSeq[rowNum] + colNum;
//                 if (cellName in worksheet) {  //空白单元格不会出现在worksheet中，因此需要事先检测
//                     if (title[rowNum] != 'volunteer') {
//                         interviewee[title[rowNum]] = worksheet[cellName].v;
//                     }
//                     else {
//                         let d = deps[worksheet[cellName].v];
//                         if (!isNaN(d * 1)) {
//                             if (!interviewee['volunteer']) {
//                                 interviewee['volunteer'] = [];
//                             }
//                             if (interviewee['volunteer'].indexOf(d) == -1) {
//                                 interviewee['volunteer'].push(d);
//                             }
//                             else {
//                                 throw new Error('出错了');
//                             }
//                         }
//                     }
//                 }
//             }
//             if (isNaN((interviewee['sid'] + interviewee['sex'] + interviewee['phone'] + (interviewee['qq'] || 1) * 1))) { //判断这四项是否都是数字
//                 throw new Error('出错了');
//             }
//             Interviewee.addInterviewee(interviewee, cid);
//         }
//         return colNum;
//     })
// };


exports.update = function (cid, data) {
    return IntervieweeModel.remove({
        cid: cid
    }).then(result => {
        return clubModel.findOneAndUpdate({
            cid: cid
        }, data)
    }).then(result => {
        return result;
    })
};


exports.exportInterviewees = function (cid, did) {
    return IntervieweeModel.find({
        cid: cid,
        'rate.did': did
    }, 'name sid rate notion phone qq email major sex').then(result => {
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
    }).then(result => {
        let info = [];
        result.departments.forEach(e => {
            let column = [];
            e.column.forEach(i => {
                column.push(i.columnName);
            });
            info.push({
                name: e.name,
                column: column
            });
        });
        return ({
            clubName: result.name,
            department: info
        });
    })
};

exports.verifyInfo = function (info) {
    return clubModel.findOne({
        cid: info.clubID
    }).then(result => {
        if (!result || !(info.club == result.name)) throw new Error("社团id错误！");
        result.password = null;
        return result;
    });
};


exports.insertInfo = function (data) {
    let model = new clubModel(data);
    model.save().then(result => {
        return result;
    });
};